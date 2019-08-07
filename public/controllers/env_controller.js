class EnvironmentController {
    
    constructor(env){
        this.env = env;
    }


    addNode(node){
        let {
            nodes,
            links
        } = this.env;

        this.env = {
            nodes: [...nodes, node],
            links: [...links]
        }
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

      this.update({nodes, links});
    
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
            nodes: [...nodes],
            links: [...links, link]
        });
        
        this.gData = this.graph.graphData;
    }        



    removeLink(link){

    }
}