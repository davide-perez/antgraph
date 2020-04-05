class EnvironmentEditor {

    constructor(domElem){
        this.domElem = domElem;
        this.NODE_REL_SIZE = 8;
        this.selectedNodes = [];
        this.selectedEdge = null;
        this.graphObj = ForceGraph()
            .width(600)
            .height(400)
            .nodeRelSize(this.NODE_REL_SIZE) // Solve this stuff
            .backgroundColor("pink")
            .cooldownTicks(0);
        this.setupGraphicEvents();
    }


    setupGraphicEvents(){
        this.setupHighlighting();
    }

    // admit at most two nodes highlighted, so that the next selected one takes the place of the first one?
    // So it becomes easy to add an arc!

    // move events in other functions?
    setupHighlighting(){
        this.graphObj
        .onNodeClick(node => {
            //selectedNodes = node ? [node] : [];
            if(node){
                //latest
                let index = this.selectedNodes.findIndex(n => (n === node));
                if(index !== -1){
                    console.log('Node ' + node.id + ' already selected. Removing from selection.');
                    this.selectedNodes.splice(index,1);
                    return;
                }
                // latest
                this.selectedNodes.push(node);
                if(this.selectedNodes.length > 2){
                    this.selectedNodes.shift();
                }
            }
            this.domElem.style.cursor = node ? '-webkit-grab' : null;
          })
        .onNodeHover(node => {

        })
        .onLinkHover(edge => {
            // display node info on a navigator?
          })
        .onLinkClick(edge => {
            if(edge){
                this.selectedEdge = edge;
            }
        })
        .linkColor('red')
        .linkWidth(edge => edge === this.selectedEdge ? 5 : 1)
        .linkDirectionalParticles(4)
        //.linkDirectionalParticleWidth(edge=> edge === highlightedEdge ? 4 : 0)
        .linkCurvature(0.3) // make this proportional to number of links between nodes
        .nodeCanvasObjectMode(node => this.selectedNodes.indexOf(node) !== -1 ? 'before' : undefined)
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