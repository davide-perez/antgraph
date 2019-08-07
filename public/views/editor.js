class Editor{


    constructor(domElement){
        if(!domElement){
            this.domElement = document.getElementById('graph');
        }
        else{
            this.domElement = domElement;       
        }
        this.controller = new EnvironmentController();
        this.graphObj = null;
        this.highlightedNodes = [];
        this.highlightedLink = [];
        this.initGraph();
    }


    initGraph(){
        this.highlightLink = null;
        this.controller.addNode();
        this.controller.addNode();
        this.controller.addNode();
        let data = this.controller.fetchData();
        console.log("Data is " + JSON.stringify(data));
        this.graphObj = ForceGraph()(this.domElement)
                    .linkDirectionalParticles(2)
                    .cooldownTicks(0.1)
                    .onNodeHover(node => {
                        this.highlightedNodes = node ? [node] : [];
                        this.domElement.style.cursor = node ? '-webkit-grab' : null;
                        showInfo(node);
                      })
                    .nodeCanvasObjectMode(node => isHighlighted(node, this.highlightedNodes) ? 'before' : undefined)
                    .nodeCanvasObject((node, ctx) => {
                        drawHighlighted(node, ctx);
                      })
                    .graphData(data);
    }


    update(newData){
        if(!newData)
            this.graphObj.refresh(false);
        else
            this.graphObj.graphData(newData);
    }

}