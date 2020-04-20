class EnvironmentEditor {

    constructor(domElem){

        this.domElem = domElem;
        this.NODE_REL_SIZE = 15; // config file vs db setup table
        this.selectedNodes = [];
        this.selectedLink = null;
        this.graphObj = ForceGraph();

        //this.setupGraphicEvents();
        this.initGraph();
        this.setupEvents();
        this.setupCanvas();
    }


    
    initGraph(){
        this.graphObj
        .width(1400)
        .height(800)
        .nodeRelSize(this.NODE_REL_SIZE) // Solve this stuff
        .backgroundColor('white')
        .cooldownTicks(0)
        .linkColor(link => link === this.selectedLink ? 'blue' : 'grey')
        .linkWidth(link => link === this.selectedLink ? 10 : 5)
        .linkDirectionalParticles(0)
        //.linkDirectionalParticleWidth(edge=> edge === highlightedEdge ? 4 : 0)
        .linkDirectionalParticleSpeed(0.001)
        .linkDirectionalParticleColor(() => 'red')
        .linkDirectionalArrowLength(12)
        .linkCurvature('curvature')
    }

    setupEvents(){
        this.graphObj
        .onNodeRightClick(node => this.handleNodeRightClick(node))
        .onLinkClick(link => this.handleLinkClick(link))
        .onLinkRightClick(link => this.handleLinkRightClick(link))
    }


    setupCanvas(){
        this.graphObj
        .nodeCanvasObjectMode(node => this.selectedNodes.indexOf(node) !== -1 ? 'before' : undefined)
        .nodeCanvasObject((node, ctx) => {
          ctx.beginPath();
          ctx.arc(node.x, node.y, this.NODE_REL_SIZE * 1.4, 0, 2 * Math.PI, false);
          ctx.fillStyle = 'red';
          ctx.fill();
        })     
    }


    handleNodeRightClick(node){
        if(node){
            let index = this.selectedNodes.findIndex(n => (n === node));
            if(index !== -1){
                this.selectedNodes.splice(index,1);
                return;
            }
            this.selectedNodes.push(node);
            if(this.selectedNodes.length > 2){
                this.selectedNodes.shift();
            }
        }
        this.domElem.style.cursor = node ? '-webkit-grab' : null;
    }

    handleLinkRightClick(link){
        if(link){
            if(this.selectedLink === link)
                this.selectedLink = null
            else
                this.selectedLink = link;
        }
    }


    emitParticle(link){
        if(link){
            this.graphObj.emitParticle(link);
        }
    }

    

    update(env){
        this.graphObj(this.domElem)
        .graphData(env);
    }

    resetSelection(){
        this.selectedNodes = [];
        this.selectedLink = null;
    }



}