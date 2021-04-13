### GraphXR Iframe example(V2.10.0 beta)

Your can try with <https://kineviz.github.io/graphxr-iframe-example/> at first

> Please refer the <https://kineviz.github.io/graphxr-iframe-example/graphXR.injection.js> in <head> tag at first

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
http://localhost:3000?embedGraphURL=https://graphxrdev.kineviz.com/p/602d2b0787329b003351adee/blank/6033b824378ffc0034884a58/IP-TEST
```
 
### 1. ApiCommand 
> Please sure the graphXR iframe already load, please refer 3.1

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
    console.warn("Receive graphStat:", resData.content)
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
    console.warn("Receive selected data:", resData.content)
}) 
``` 

#### 1.5 get top 200 nodes nearby camera  {nodes}

```
graphXR.injectionApiCommand(':nearby', iframeElem)
.then((resData) => {
    console.warn("Receive nearby data:", resData.content)
}) 
``` 

#### 1.6 query resData.content {nodes:number,edges:number}

```
graphXR.injectionApiCommand('MATCH (n)-[r]-(m) RETURN * LIMIT 100', iframeElem)
.then((resData) => {
    console.warn("Receive query data:", resData.content)
})
```

If you do not want node append to graphXR, please set ignoreAppend as true
```
graphXR.injectionApiCommand('MATCH (n)-[r]-(m) RETURN * LIMIT 100', iframeElem,{ignoreAppend:true})
.then((resData) => {
    console.warn("Receive query data:", resData.content)
})
       
```

###  2. Injection Function (graphXR.injectionApiFunc) 
> Please sure the graphXR iframe already load, please refer 3.1

#### 2.1 update twinkled 

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive all data:", resData.content)
    const {nodes, edges} = resData.content;

    //update twinkled 
    let colors =['red','yellow','green',null]
    let topNode10 = (nodes ||[]).slice(0,10).map((n,i) =>{
        //will can auto update the props to the node
        let otherProps ={_index:i}
        return{
          id: n._GXRID,
          rate: i%4+1,
          color: colors[i%4],//color is null, mean rest to bak
          ...otherProps
        }
    })
    let  ignoreTwinkled = true; // skip clear old twinkled
    graphXR.injectionApiFunc(
        "updateTwinkled",
        { nodes: topNode10, ignoreTwinkled },
        iframeElem
        );
})
 
```

```
//clear twinkled
 let ignoreTwinkled = false;
  graphXR.injectionApiFunc(
        "updateTwinkled",
        { nodes: [], ignoreTwinkled },
        iframeElem
        );
```
 
 
#### 2.2 flyTo 

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive all data:", resData.content)
    const {nodes, edges} = resData.content;
    let flyToNode = nodes[0];
    if(!flyToNode){
        return 
    }
     graphXR.injectionApiFunc(
        "flyTo",
         flyToNode._GXRID,
        iframeElem
        );
})
 
```

#### 2.3 Select nodes 

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive all data:", resData.content)
    const {nodes} = resData.content;
    //Select all nodes
   graphXR.injectionApiFunc(
        "selectWithNodeIds",
        { nodeIds: nodes.map(n => n._GXRID) },
        iframeElem
        );
})
```
 
#### 2.4 highlightWithNodeIds 

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive all data:", resData.content)
    const {nodes, edges} = resData.content;

    //    highlightWithNodeIds
     let top10NodeIds = (nodes ||[]).slice(0,10).map((n,i) =>{
         return   n._GXRID 
    })
     graphXR.injectionApiFunc(
        "highlightWithNodeIds",
        { nodeIds: top10NodeIds, nodeOnly:false },
        iframeElem
        );
})
 
```

#### 2.5 highlightWithEdgeIds 

```
graphXR.injectionApiCommand(':getGraph', iframeElem)
.then((resData) => {
    console.warn("Receive all data:", resData.content)
    const {nodes, edges} = resData.content;

    //    highlightWithEdgeIds
     let top10EdgeIds = (edges ||[]).slice(0,10).map((e,i) =>{
          return   e._GXRID 
    })
     graphXR.injectionApiFunc(
        "highlightWithEdgeIds",
        { edgeIds: top10EdgeIds, edgeOnly:false },
        iframeElem
        );
})
 
```

#### 2.6 getNodeWithId 

```
let _GXRID = 9999999999;
  graphXR.injectionApiFunc(
        "getNodeWithId",
         _GXRID,
        iframeElem
        ).then( res =>{
    console.warn("Got Node:", res.content)
})
 
```

#### 2.7 getNodeWithProps 

```
//find the node where name = 'Sean' 
graphXR.injectionApiFunc(
        "getNodeWithProps",
         {name:"Sean"},
        iframeElem
        ).then( res =>{
    console.warn("Got Node:", res.content)
})
 
```

###  3. event,  only support ['change','select']

#### 3.1 graphxr load event
>  You can use load event sure the GraphXR iframe already loaded
``` 
graphXR.injectionOn("load", (eventName, res) => {
    if(res === 'init'){
    console.warn("GraphXR iframe already load", res)
    }else{
    console.warn("GraphXR Load the view ", res)
    }
}, iframeElem, "iframe-unique-name")

```

#### 3.2 graphxr change event

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

#### 3.3 graphxr select event

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

#### 3.4 graphxr nearby event

``` 
graphXR.injectionOn("nearby", (eventName, res) => {
    console.warn("receive nearby nodes", res)
}, iframeElem, "iframe-unique-name")

```


#### 4 Injection Code

> InjectionCode is beta function, so do not recommand use it. 
> Please sure the graphXR iframe already load, please refer 3.1
 
#### 4.1 Layout  

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