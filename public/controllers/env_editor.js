class EnvironmentEditor {

    constructor(domElem){
        this.domElem = domElem;
        this.NODE_REL_SIZE = 8;
        this.graphObj = ForceGraph()
            .width(600)
            .height(400)
            .nodeRelSize(this.NODE_REL_SIZE) // Solve this stuff
            .backgroundColor("yellow")
            .cooldownTicks(0);
        this.setupGraphicEvents();
    }


    setupGraphicEvents(){
        this.setupHighlighting();
    }

    // admit at most two nodes highlighted, so that the next selected one takes the place of the first one?
    // So it becomes easy to add an arc!
    setupHighlighting(){
        let highlightedNodes = [];
        let highlightedEdge = null;
        this.graphObj
        .onNodeClick(node => {
            highlightedNodes = node ? [node] : [];
            this.domElem.style.cursor = node ? '-webkit-grab' : null;
          })
        .onLinkHover(edge => {
            highlightedEdge= edge;
            highlightedNodes = edge ? [edge.source, edge.target] : [];
          })
        .linkWidth(edge => edge === highlightedEdge ? 5 : 1)
        .linkDirectionalParticles(4)
        .linkDirectionalParticleWidth(edge=> edge === highlightedEdge ? 4 : 0)
        .nodeCanvasObjectMode(node => highlightedNodes.indexOf(node) !== -1 ? 'before' : undefined)
        .nodeCanvasObject((node, ctx) => {
          // add ring just for highlighted nodes
          ctx.beginPath();
          ctx.arc(node.x, node.y, this.NODE_REL_SIZE * 1.4, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'red';
          ctx.fill();
        })
    }

    update(dataset){
        this.graphObj(this.domElem)
        .graphData(dataset);
    }



}