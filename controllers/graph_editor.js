// Graph search -> https://github.com/vasturiano/force-graph/issues/16
class GraphEditor {
  constructor(domElem) {
    this.domElem = domElem;
    this.NODE_REL_SIZE = 15;
    this.CANVAS_WIDTH = CANVAS_WIDTH || 1000;
    this.CANVAS_HEIGHT = CANVAS_HEIGHT || 800;
    this.selectedNodes = [];
    this.selectedLink = null;
    this.graphObj = ForceGraph();
  }

  render(){
    this.initGraph();
    this.setupEvents();
    this.setupCanvas();   
  }

  disableInteraction(){
    this.graphObj
      .linkDirectionalParticles(0)
      .enableNodeDrag(false)
      .enableZoomPanInteraction(false)
      .enablePointerInteraction(false)
      .pauseAnimation();
  }

  enableInteraction(){
    this.graphObj
      .enableNodeDrag(true)
      .enableZoomPanInteraction(true)
      .enablePointerInteraction(true)
      .resumeAnimation();
  }

  initGraph() {
    this.graphObj
      .width(this.CANVAS_WIDTH)
      .height(this.CANVAS_HEIGHT)
      .nodeRelSize(this.NODE_REL_SIZE) // Solve this stuff
      .backgroundColor('white')
      .nodeColor(node =>{
        switch(node.classification){
          case 'start':
            return 'gold';
          case 'goal':
            return 'coral';
          default:
            return 'lightblue';
        }
      })
      .nodeLabel(node => {
        let label = `Id: ${node.id}<br>Type: ${node.classification}<br>Coords: (${node.x.toFixed(2)},${node.y.toFixed(2)})`;
        if(node.noOfAnts !== undefined)
          label += `<br>No. of ants: ${node.noOfAnts}`;
        return label;
      })
      .cooldownTicks(0)
      .linkColor((link) => (link === this.selectedLink ? 'blue' : 'grey'))
      .linkWidth((link) => (link === this.selectedLink ? 5 : 1))
      .linkDirectionalParticles(0)
      .linkDirectionalParticleSpeed(0.001)
      .linkDirectionalParticleColor((link) => link.isMainLink ? 'red' : 'purple')
      .linkDirectionalParticleWidth(5)
      .linkDirectionalArrowLength(10)
      .linkDirectionalArrowRelPos(1)
      .zoomToFit();
      //.linkVisibility(l => l.isMainLink);
  }

  setupEvents() {
    this.graphObj
      .onNodeRightClick((node) => this.handleNodeRightClick(node))
      .onLinkClick((link) => this.handleLinkClick(link))
      .onLinkRightClick((link) => this.handleLinkRightClick(link));
  }

  setupCanvas() {
    this.graphObj
      .nodeCanvasObjectMode((node) =>
     this.selectedNodes.indexOf(node) !== -1 ? 'before' : undefined
      )
      .nodeCanvasObject((node, ctx) => {
        ctx.beginPath();
        ctx.arc(
          node.x,
          node.y,
          this.NODE_REL_SIZE * 1.4,
          0,
          2 * Math.PI,
          false
        );
        ctx.fillStyle = 'red';
        ctx.fill();
      })
      .linkCanvasObjectMode(() => 'after')
      .linkCanvasObject((link, ctx) => {

        if(!INTERACTIVE_MODE)
          return;

        if(!link.isMainLink)
          return;

        const MAX_FONT_SIZE = 15;
        const LABEL_NODE_MARGIN = this.graphObj.nodeRelSize() * 1.5;

        const start = link.source;
        const end = link.target;

        // ignore unbound links
        if (typeof start !== 'object' || typeof end !== 'object') 
          return;

        // calculate label positioning
        const textPos = Object.assign(
          ...['x', 'y'].map((c) => ({
            [c]: start[c] + (end[c] - start[c]) / 2, // calc middle point
          }))
        );

        const relLink = {
          x: end.x - start.x,
          y: end.y - start.y,
        };

        const maxTextLength =
          Math.sqrt(Math.pow(relLink.x, 2) + Math.pow(relLink.y, 2)) -
          LABEL_NODE_MARGIN * 2;

        let textAngle = Math.atan2(relLink.y, relLink.x);
        // maintain label vertical orientation for legibility
        if (textAngle > Math.PI / 2) textAngle = -(Math.PI - textAngle);
        if (textAngle < -Math.PI / 2) textAngle = -(-Math.PI - textAngle);

        // highlight how this is a visual render only! true value is not altered.
        if(!link.pheromone)
          return;
        const label = link.pheromone.toFixed(2);

        // estimate fontSize to fit in link length
        ctx.font = '1px Sans-Serif';
        const fontSize = Math.min(
          MAX_FONT_SIZE,
          maxTextLength / ctx.measureText(label).width
        );
        ctx.font = `${fontSize}px Sans-Serif`;
        const textWidth = ctx.measureText(label).width;
        const bckgDimensions = [textWidth, fontSize].map(
          (n) => n + fontSize * 0.2
        ); // some padding

        // draw text label (with background rect)
        ctx.save();
        ctx.translate(textPos.x, textPos.y);
        ctx.rotate(textAngle);

        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(
          -bckgDimensions[0] / 2,
          -bckgDimensions[1] / 2,
          ...bckgDimensions
        );

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = 'blue';
        ctx.fillText(label, 0, 0);
        ctx.restore();
      });
  }

  handleNodeRightClick(node) {
    if (node) {
      let index = this.selectedNodes.findIndex((n) => n === node);
      if (index !== -1) {
        this.selectedNodes.splice(index, 1);
        return;
      }
      this.selectedNodes.push(node);
      if (this.selectedNodes.length > 2) {
        this.selectedNodes.shift();
      }
    }
    this.domElem.style.cursor = node ? '-webkit-grab' : null;
  }

  handleLinkRightClick(link) {
    if (link) {
      if (this.selectedLink === link) this.selectedLink = null;
      else
        this.selectedLink = link;
    }
  }

  emitParticle(link) {
    if (link) {
      this.graphObj.emitParticle(link);
    }
  }

  update(graph) {
    this.graphObj(this.domElem).graphData(graph).zoomToFit();
    this.resetSelection();
  }

  notify(data){
    this.update(data);
  }

  resetSelection() {
    this.selectedNodes = [];
    this.selectedLink = null;
  }
}
