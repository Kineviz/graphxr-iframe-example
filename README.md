### GraphXR Iframe example(V2.8.0)

> Please refer the graphXR.injection.js in <head> tag at first

```
 <script src='graphXR.injection.js'></script>
```

iframeElem is a iframe dom element.

```
let iframeElem = document.getElementById("injection-graphXR-iframe-id");
```

Embed iframe
```
<iframe id="injection-graphXR-iframe-id"  origin="*" > </iframe>
```



### How run it(For Develop)

```
yarn && yarn start
```
then add graphXR share link as iframe embedGraphURL.
You can change defaultEmbedGraphURL in index.html line 116

```
http://localhost:3000?embedGraphURL=https://graphxr.kineviz.com/share/5c633dfe197b00001e855294/VC%20investment%202004-2013/5c65e7be851f2c0036ef27c9
```

### 1. ApiCommand 

#### 1.1 getGraph resData.content {nodes,edges}

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive graphData:", resData.content)
})
```

#### 1.2 getGraphStat resData.content {nodes:number,edges:number}

``` 
graphXR.injectionApiCommand(':getGraphStat', iframeElem)
.then((resData) => {
    console.warn("Receive getGraphStat:", resData.content)
})
```

#### 1.3 clearGraph resData.content {}

``` 
graphXR.injectionApiCommand(':clearGraph', iframeElem)
.then((resData) => {
    console.warn("Receive clearGraph:", resData.content)
})
```

#### 1.4 selected graph resData.content {nodes:number,edges:number}

```
graphXR.injectionApiCommand(':selected', iframeElem)
.then((resData) => {
    console.warn("Receive query data:", resData.content)
}) 
``` 

#### 1.5 query resData.content {nodes:number,edges:number}

```
graphXR.injectionApiCommand('MATCH (n)-[r]-(m) RETURN * LIMIT 100', iframeElem)
.then((resData) => {
    console.warn("Receive query data:", resData.content)
})
```


###  2. Injection codes 

#### 2.1 select all

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive all data:", resData.content)
    const {nodes, edges} = resData.content;

    //select all 
    graphXR.injectionCode(`
        _GXR.NodesSelectManager.selectWithNodeIds(${JSON.stringify(nodes.map(n => n._GXRID))},'new')
    ` , iframeElem).then(resData => {
        console.warn("Injection success:", resData)
    })
})
```

 
###  3. event,  only support ['change','select']


#### 3.1 graphxr change event

```
graphXR.injectionOn("change", () => {
    console.warn("receive change event");
    // Please use :getGraph got all data
    // graphXR.injectionApiCommand(':getGraph', iframeElem)
    // .then((resData) => {
    //     console.warn("Receive graphData:", resData.content)
    // })
}, iframeElem, "iframe-unique-name")
```

#### 3.2 graphxr select event

``` 
graphXR.injectionOn("select", () => {
    console.warn("receive select event")
    //please use :selected got all selected nodes
    graphXR.injectionApiCommand(':selected', iframeElem)
        .then((resData) => {
            console.warn("Receive selected:", resData.content)
        })
}, iframeElem, "iframe-unique-name")

```


#### 4. Layout  

Support force, line, grid, circle, cube

force Layout e.g.   

``` 
   graphXR.injectionCode(`
    _app.controller.API.setLayout("force")
    ` , iframeElem).then(resData => {
        console.warn("use force success:", resData)
    })
```

circle Layout e.g.   

``` 
   graphXR.injectionCode(`
    _app.controller.API.setLayout("circle")
    ` , iframeElem).then(resData => {
        console.warn("use circle success:", resData)
    })
```