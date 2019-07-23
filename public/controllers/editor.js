//Maybe the utilities to add and remove the nodes should be put in a Builder class.
//Agent events will take place here.

class Editor{

    constructor(domElement) {
        if(!domElement){
            domElement = document.getElementById('graph');
        }

        this.gData = {nodes: [], links:[]};
        this.initGraph();

        this.lastClickedNode = null;


    }


    initGraph(){
        this.graph = ForceGraph()
        (document.getElementById('graph'))
            .linkDirectionalParticles(19)
            .cooldownTicks(0.1)
            .onNodeHover(function(node, prevNode){
                console.log("Node: " + JSON.stringify(node))
            })
            .onNodeRightClick(n => this.removeNode(n))
            .onNodeClick(n => this.lastClickedNode = n)
            .width(600)
            .height(400)
            .backgroundColor('red')
            .graphData(this.gData);        
    }

    
    addNode(node){
        let {
            nodes,
            links
        } = this.graph.graphData();
        const id = nodes.length;
        this.graph.graphData({
            nodes: [...nodes, node],
            links: []
        });
        
        this.gData = this.graph.graphData;
    }


    removeNode(node) {
        let {
            nodes,
            links
        } = this.graph.graphData();
        links = links.filter(l => l.source !== node && l.target !== node); // Remove links attached to node 
    
      // Remove node 
      nodes.splice(node.id, 1); 
      
      // Reset node ids to array index 
      nodes.forEach((n, idx) => { n.id = idx; }); 
      
      this.graph.graphData({ nodes, links });
      
      this.gData = this.graph.graphData;
    
    }


    setLinkTo(node){
        if(!this.lastClickedNode){
            this.addLink(this.lastClickedNode, node);
        }
        else{
            this.lastClickedNode = node;
        }
    }


    addLink(startNode, endNode){
        let {
            nodes,
            links
        } = this.graph.graphData();
        const id = links.length;
        this.graph.graphData({
            nodes: [...nodes, node],
            links: [...links, link]
        });
        
        this.gData = this.graph.graphData;
    }        



    removeLink(link){

    }
}