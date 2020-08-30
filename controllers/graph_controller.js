// add options to disable graphics.
class GraphController {

    constructor(domElem, graph) {
        this.graph = graph || new Graph();
        this.renderer = new GraphEditor(domElem);

        this.graph.registerObserver(this.renderer);
    }

    drawEnvironment(){
        this.renderer.render();
    }

    addNodeLabelProperty(propertyName, propertyCaption){
        this.renderer.nodeLabelProperties.push({name: propertyName, caption: propertyCaption});
    }

    addLinkLabelProperty(propertyName, propertyCaption){
        this.renderer.linkLabelProperties.push({name: propertyName, caption: propertyCaption});
    }

    insertNode(label, id, classification) {
        label = label || '';
        id = id || this.graph.generateId();
        classification = classification || 'normal';
        let node = new AntNode(label);
        node.classification = classification;
        if (!this.graph.rename(node, id)) {
            throw new Error('Node ' + id + 'already exists.');
        };
        this.graph.addNode(node);
    }

    //test
    insertAnonymousNode(label){
        var node = new AntNode(label);
        label = label || '';
        var id = this.graph.generateId();
        if (this.graph.rename(node, id))
            this.graph.addNode(node);
        return node;
    }

    getNode(id) {
        var node = this.graph.findNodeById(id);
        if(!node)
            throw new Error('Node ' + id + ' does not exist.');
        return node;
    }

    // solution to avoid undefined: insert default graph with some sample data
    insertNodeAt(label, id, classification, x, y) {
        label = label || '';
        id = id || this.graph.generateId();
        let node = new AntNode(label);
        node.classification = classification || 'normal';
        if (!this.graph.empty() && (x && y)) {
            let pos = this.renderer.graphObj.screen2GraphCoords(x, y);
            node.x = pos.x;
            node.y = pos.y;
        }
        if (!this.graph.rename(node, id)) {
            throw new Error('node ' + id + 'already exists in this environment.');
        };
        this.graph.addNode(node);
    }


    insertLink(startNode, endNode) {
        let link = new AntLink(startNode, endNode);
        let reverseLink = new AntLink(endNode, startNode);
        reverseLink.isMainLink = false;
        this.graph.addLink(link);
        this.graph.addLink(reverseLink);
    }


    insertLinkFromUserSelection() {
        let selectedNodes = this.renderer.selectedNodes;
        if (selectedNodes.length !== 2)
            return;
        this.insertLink(selectedNodes[0], selectedNodes[1]);

    }

    updateDirectionalParticles(maxTreshold){
        this.renderer.graphObj.linkDirectionalParticles((link) => link.pheromone < maxTreshold ? Math.ceil(link.pheromone/5) : maxTreshold);
    }

    doEvaporation(factor){
        this.graph.links.map((link) => link.pheromone = (1 - factor) * link.pheromone);
    }

    deleteNodeFromUserSelection() {
        let selectedNodes = this.renderer.selectedNodes;
        if (selectedNodes.length !== 1)
            return;
        if (this.graph.removeNode(selectedNodes[0])) {
            this.renderer.resetSelection();
        }
    }

    deleteLinkFromUserSelection() {
        let selectedLink = this.renderer.selectedLink;
        let reverseLink = this.findComplementaryLink(selectedLink);
        if (!selectedLink || !reverseLink)
            return;
        if (this.graph.removeLink(selectedLink) && this.graph.removeLink(reverseLink)) {
            this.renderer.resetSelection();
        }
    }

    setNodeClassificationFromUserSelection(classification){
        let selectedNodes = this.renderer.selectedNodes;
        if(selectedNodes.length !== 1)
            return;
        this.graph.setNodeClassification(selectedNodes[0], classification);
    }

    findNodesByClassification(classification) {
        return this.graph.nodes.filter(e => (e.classification === classification));
    }


    findOutgoingLinks(startNode) {
        return this.graph.links.filter(e => e.source === startNode) || [];
    }

    findComplementaryLink(link){
        return this.graph.findLinkBetweenNodes(link.target,link.source)
    }

    selectRandomNode(){
        return this.graph.nodes[Math.floor(Math.random() * this.graph.nodes.length)]
    }

    selectRandomLink(){
        return this.graph.links[Math.floor(Math.random() * this.graph.links.length)]
    }

    registerObserverOnGraph(observer){
        this.graph.registerObserver(observer);
    }

    removeObserverOnGraph(observer){
        this.graph.unregisterObserver(observer);
    }

    resetEditor(){
        this.renderer.update(this.graph);
    }

    reinit(){
        this.graph.reset();
    }

    reset(pheromoneDefault){
        this.graph.nodes.map(node => node.noOfAnts = 0);
        this.graph.links.map(link => link.pheromone = pheromoneDefault);
    }

}
