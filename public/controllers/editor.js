//Maybe the utilities to add and remove the nodes should be put in a Builder class.
//Agent events will take place here.

class Editor{

    constructor(domElement) {
        if(!domElement){
            this.domElement = document.getElementById('graph');
        }
        else{
            this.domElement = domElement;
        }

        this.initGraph();

        this.initDOMListeners();

    }


    initGraph(){
        this.graph = ForceGraph()
        (this.domElement)
            .linkDirectionalParticles(19)
            .cooldownTicks(0.1)
            .onNodeHover(function(node, prevNode){
                //console.log("Node: " + JSON.stringify(node))
            })
            //.onNodeRightClick(n => this.removeNode(n))
            .onNodeRightClick(n => this.removeNode(n))
            .width(600)
            .height(400)
            .backgroundColor('red')
            .graphData({nodes:  [{id:1}], links: []});
    }

// DOM event helper? Not class, just a file with the various events. + isolation, + clarity. Problem with this keyword?
// Maybe no, if both context and a function is passed.
    initDOMListeners(){
        let self = this;//here is the trick
        let clickHandler = function(ev){
            if(ev.button == 0)
                self.addNode({id:1});
        }
        this.domElement.addEventListener('click', clickHandler);
    }


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// add update(gData) ?    
    addNode(node){
        let {
            nodes,
            links
        } = this.graph.graphData();
        const id = nodes.length;
        let newGraphData = {
            nodes: [...nodes, node],
            links: [...links]
        }
        this.update(newGraphData);
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


    update(newData){
        this.graph.graphData(newData);
    }
}