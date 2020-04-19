class EnvironmentEditor {

    constructor(domElem){

        this.domElem = domElem;
        this.NODE_REL_SIZE = 8; // config file vs db setup table
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
        .width(600)
        .height(400)
        .nodeRelSize(this.NODE_REL_SIZE) // Solve this stuff
        .backgroundColor("pink")
        .cooldownTicks(0)
        .linkColor('red')
        .linkWidth(link => link === this.selectedLink ? 5 : 1)
        .linkDirectionalParticles(4)
        //.linkDirectionalParticleWidth(edge=> edge === highlightedEdge ? 4 : 0)
        .linkCurvature('curvature')
    }

    setupEvents(){
        this.graphObj
        .onNodeClick(node => this.handleNodeClick(node))
        .onLinkClick(link => this.handleLinkClick(link))
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


    handleNodeClick(node){
        if(node){
            let index = this.selectedNodes.findIndex(n => (n === node));
            if(index !== -1){
                console.log('Node ' + node.id + ' already selected. Removing from selection.');
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

    handleLinkClick(link){
        if(link){
            if(this.selectedLink === link)
                this.selectedLink = null
            else
                this.selectedLink = link;
        }
    }

    
/*
* Link object accessor function, attribute or a numeric constant for the curvature radius of the link line. 
* Curved lines are represented as bezier curves, and any numeric value is accepted. A value of 0 renders a straight line. 
* 1 indicates a radius equal to half of the line length, causing the curve to approximate a semi-circle. 
* For self-referencing links (source equal to target) the curve is represented as a loop around the node, with length proportional to the curvature value. 
* Lines are curved clockwise for positive values, and counter-clockwise for negative values. 
* Note that rendering curved lines is purely a visual effect and does not affect the behavior of the underlying forces.
***************************************************************************************************************************
* Plan: curvature proportional to number of edges between the two nodes. Pass a function that evaluates it.
*/


    update(env){
        this.graphObj(this.domElem)
        .graphData(env);
    }

    resetSelection(){
        this.selectedNodes = [];
        this.selectedLink = null;
    }



}