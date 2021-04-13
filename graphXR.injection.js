; (function ($) {
    'use strict'

    const version = '2.10.0';

    const GIframeOnMessageHandlerMap = {
        //id: {id,  iframeElement,  messageHandler}
    }

    const GEvents = {
        "change": {},
        "select": {},
        "nearby":{},
        'load':{}
    }

    let GTempResponse = {
        index: -1,
        status: 0,
        message: null,
        content: {}
    };

    function getIframeElem(){
        return  document.querySelectorAll("iframe")[0]
     }

    function clearIframeMessage(id) {

        if (GIframeOnMessageHandlerMap[id] ) {
            GIframeOnMessageHandlerMap[id].iframeElement.contentWindow.parent.removeEventListener(
                'message',
                GIframeOnMessageHandlerMap[id].messageHandler,
                false);
            delete GIframeOnMessageHandlerMap[id]
        }
    }
    function handleIframeAddMessage(id,iframeElement = getIframeElem()) {

        if (!iframeElement || !id) {
            return console.error("miss iframeElement or id")
        }

        if (!GIframeOnMessageHandlerMap[id]) {
            GIframeOnMessageHandlerMap[id] = {
                id,
                iframeElement,
                messageHandler: function (e) {
                    let data = e.data && typeof (e.data) === 'object' ? e.data : {};
                    let type = String(data.type).toLocaleLowerCase();
                    if (type === 'codes') {
                        GTempResponse = data.response;
                    } else if (type === 'api-response' || type === 'api') {
                        GTempResponse = {
                            index: data.command,
                            status: 0,
                            content: data.response && data.response.data ? data.response.data : {}
                        }
                    }
                }
            }
            iframeElement.contentWindow.parent.addEventListener('message', GIframeOnMessageHandlerMap[id].messageHandler, false);
        }
    }

    function untilCheck(untilFunc, maxTime = 3000) {
        return new Promise(function (resolve, reject) {
            let __useTime = 0;
            let __timer = setInterval(function () {
                if (untilFunc()) {
                    clearInterval(__timer);
                    clearIframeMessage(GTempResponse.index);
                    resolve(GTempResponse);
                } else if (__useTime > maxTime) {
                    clearInterval(__timer);
                    reject(new Error(`Timed out in ${maxTime}ms.`))
                }
            }, 60);
        });
    }

    function injectionCode( code, iframeElement = getIframeElem(), index = Date.now(),  type = 'codes', params = {}) {
        if (!iframeElement || iframeElement.tagName !== "IFRAME") {
            let err = new Error(`Only support iframe element, please try document.getElementById("your_iframe_id");`);
            console.error(err.message);
            return Promise.reject(err);
        }
        index =  String(index);
        //reset GTempResponse 
        GTempResponse = {
            index: -1,
            status: 0,
            message: null
        };


        let postMessageBody = {

        };

        if (type === 'api') {
            index = code;
            postMessageBody = {
                type: "api",
                command: code,
                params
            }
        } else  if (type === 'func') {
            index = code;
            postMessageBody = {
                type: "func",
                func: code,
                params
            }
        } else {
            postMessageBody = {
                type: "codes",
                codes: [{
                    index: index,
                    code: code
                }]
            }
        }

        handleIframeAddMessage(index, iframeElement);

        // * allow cross origin post message
        iframeElement.contentWindow.postMessage(postMessageBody, "*");

        return untilCheck(() => { return GTempResponse && String(GTempResponse.index).toLowerCase() === String(index).toLowerCase() });
    }

    function injectionCodes(codes, iframeElement = getIframeElem()) {

        if (!Array.isArray(codes)) {
            let err = new Error(`The codes must be as array`);
            console.error(err.message);
            return Promise.reject(err);
        }

        //keep the async waterfall
        return codes.reduce((promiseChain, currentCodeItem, currentIndex) => {
            return promiseChain.then((chainResults) => {
                injectionCode( currentCodeItem.code, iframeElement, currentIndex).then((currentResult) => {
                    [...chainResults, currentResult]
                })
            })
        }, Promise.resolve([]));
    }

    function injectionApiFunc(funcName, params = {}, iframeElement = getIframeElem()) {

        let newFuncName = String(funcName).trim();
        if (!newFuncName && !newFuncName) {
            let err = new Error(`Please try use those functions [update]`);
            console.error(err.message);
            return Promise.reject(err);
        }
        return injectionCode( funcName, iframeElement, funcName , 'func', params)
    }

    function injectionApiCommand(command, iframeElement = getIframeElem(),  params = {}) {

        let newCommand = String(command).trim();
        if (!newCommand && !command) {
            let err = new Error(`Please try use those commands [:clearGraph, :getGraphStat, :getGraph]`);
            console.error(err.message);
            return Promise.reject(err);
        }
        return injectionCode( newCommand, iframeElement, newCommand , 'api', params)
    }

    function injectionApiCommands(commands, iframeElement = getIframeElem()) {
        if (!Array.isArray(commands)) {
            let err = new Error(`The commands must be as array`);
            console.error(err.message);
            return Promise.reject(err);
        }

        //keep the async waterfall
        return commands.reduce((promiseChain, commandItem, currentIndex) => {
            return promiseChain.then((chainResults) => {
                injectionApiCommand(commandItem, iframeElement).then((currentResult) => {
                    [...chainResults, currentResult]
                })
            })
        }, Promise.resolve([]));
    }


    function _handleInjectionOn(e) {
        let data = e.data && typeof (e.data) === 'object' ? e.data : {};
        let type = String(data.type).toLocaleLowerCase();
        let eventName = String(data.eventName).toLocaleLowerCase();
        if (type === 'events-response' && GEvents && Object.keys(GEvents[eventName] || {}).length > 0) {
            Object.values(GEvents[eventName] || {})
                .forEach(cb => {
                  cb && cb(eventName, data.response || {});
                });
        }
    }

    function injectionOn(eventName = 'change', callback = () => { }, iframeElement = getIframeElem(), uniqueName = '') {
        if (!['change', 'select','nearby','load'].includes(eventName) || !callback) {
            console.warn(`Miss eventName['change','select','nearby','load'] or callback function`);
        }

        //try remove at first, then add eventLister
        iframeElement.contentWindow.parent.removeEventListener('message', _handleInjectionOn, false);
        iframeElement.contentWindow.parent.addEventListener('message', _handleInjectionOn, false);

        if (GEvents[eventName] && callback) {
            uniqueName = uniqueName || callback.name;
            GEvents[eventName][uniqueName] = callback;

            if(eventName === 'load'){
                return "load do not need injection code";
            }
            let codeIndex = uniqueName;
            let code = `
            //convert to global
            _app.controller.API.on('${eventName}', (eventName,data) => {
                if (window.parent) {
                    window.parent.postMessage({
                        type: "events-response",
                        eventName:"${eventName}",
                        response: data
                    }, "*");
                }
            }, '${uniqueName}')
            `
            injectionCode( code, iframeElement, codeIndex);

        } else if (
            callback[eventName] &&
            !callback &&
            GEvents[eventName][uniqueName]
        ) {
            return delete GEvents[eventName][uniqueName];
        } else {
            return console.warn("Only support the events :", Object.keys(callback));
        }
    }

    const graphXR = {
        version,
        injectionCode,
        injectionCodes,
        injectionApiFunc,
        injectionApiCommand,
        injectionApiCommands,
        injectionOn
    }

    if (typeof define === 'function' && define.amd) {
        define(function () {
            return graphXR
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = graphXR
    } else {
        $.graphXR = graphXR
    }
})(this)