class EnvironmentEditor {

    constructor(drawable){
        if (drawable === undefined)
            drawable = document.getElementById("graph");

        this.env = null;
        const N = 3;
        const gData = {
            nodes: [...Array(N).keys()].map(i => ({ id: i, x: i*20, y: -i*20+30 })),
            links: [...Array(N).keys()]
              .filter(id => id)
              .map(id => ({
                source: id,
                target: Math.round(Math.random() * (id-1))
              }))
          };
          
        
        this.graph = ForceGraph()
        (document.getElementById('graph'))
            .linkDirectionalParticles(19)
            .cooldownTicks(0)
            .onNodeHover(function(node, prevNode){
                console.log("Node: " + JSON.stringify(node))
            })
            .width(600)
            .height(400)
            .backgroundColor('green')
            .graphData(gData);
        
        //this.myBasic();
        
/*
        const N = 300;
        const gData = {
            nodes: [...Array(N).keys()].map(i => ({ id: i })),
            links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
            source: id,
            target: Math.round(Math.random() * (id-1))
            }))
    };




        this.graph = ForceGraph()
        (drawable)
          .linkDirectionalParticles(1)
          .graphData(gData);

*/

        //this.dynamicTest();

    }

    initDataSet(env){
        var env_nodes = (env == null) ? [] : env.nodes;
        var env_nodes = (env == null) ? [] : env.nodes;

        return {
            nodes: env_nodes,
            links: env_edges
        };
    }


    appendNode(){
        var n = Math.floor(Math.random() * 10)
        var node = {id: n}
        console.log(JSON.stringify(this.graph.graphData))
        this.graph.graphData({nodes: [...nodes, node], links:[...links]})
        this.render();
    }


    render(){
        this.graph.refresh();
    }


    update(newData){
        this.graph.graphData(newData);
    }



    dynamicTest(){
        const initData = {
            nodes: [{
                id: 0
            }],
            links: []
        };
        const elem = document.getElementById("graph");
        const Graph = ForceGraph()(elem).onNodeHover(node => elem.style.cursor = node ? 'pointer' : null).onNodeClick(this.removeNode).graphData(initData);
        setInterval(() => {
            const {
                nodes,
                links
            } = Graph.graphData();
            const id = nodes.length;
            Graph.graphData({
                nodes: [...nodes, {
                    id
                }],
                links: [...links, {
                    source: id,
                    target: Math.round(Math.random() * (id - 1))
                }]
            });
        }, 100);
        
    }
    


    removeNode(node) {
        let {
            nodes,
            links
        } = Graph.graphData();
        links = links.filter(l => l.source !== node && l.target !== node); // Remove links attached to node 
      
      nodes.splice(node.id, 1); 
      
      // Remove node 
      nodes.forEach((n, idx) => { n.id = idx; }); 
      
      // Reset node ids to array index 
      Graph.graphData({ nodes, links }); 
    
    }
    
    basic(){
        console.log("Creating basic nodes...");
        const N = 5;
        const gData = {
          nodes: [...Array(N).keys()].map(i => ({ id: i, x: i*2, y: -i*2+3 })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round(Math.random() * (id-1))
            }))
        };
        const Graph = ForceGraph()
          (document.getElementById('graph'))
            .linkDirectionalParticles(9)
            .graphData(gData);
    }

    myBasic2(){
        const gData = {
            nodes: [{x: 0, y: 0}],
            links: []
        };
        const Graph = ForceGraph()
            (document.getElementById('graph'))
            .cooldownTicks(0)
            .width(300)
            .height(300)
            .graphData(gData);
    }


    myBasic(){
        console.log("Creating basic nodes...");
        const N = 3;
        const gData = {
          nodes: [...Array(N).keys()].map(i => ({ id: i, x: i*20, y: -i*20+30 })),
          links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
              source: id,
              target: Math.round(Math.random() * (id-1))
            }))
        };
        
        //console.log("Nodes: " + JSON.stringify(gData.nodes));
        //console.log("Edges: " + JSON.stringify(gData.links));
        const Graph = ForceGraph()
          (document.getElementById('graph'))
            .linkDirectionalParticles(9)
            .cooldownTicks(0)
            .onNodeHover(function(node, prevNode){
                console.log("Node: " + JSON.stringify(node))
            })
            .width(600)
            .height(400)
            .backgroundColor('black')
            .graphData(gData);
        console.log("Graph properties: ");
        console.table(Graph);
    }


    addNode2(posX, posY){

        console.log("Adding node at " + posX + "," + posY);
        const newData = {
            nodes: [{id:'', x: posX, y: posY}], 
            links: []
        };
        const NewGraph = ForceGraph()
        (document.getElementById('graph'))
        .linkDirectionalParticles(3)
        .graphData(newData);

    }



    addNode(){

    }
    
    

}

