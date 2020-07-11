
//Class representing the graph model. It is kept to be as generic as possible, no reference to pheromones or ants or similar stuff
class Graph {

    constructor(nodes, links) {
        this.nodes = nodes || [];
        this.links = links || [];

        /// SUBJECT ///
        this.observers = [];
    }

    //////////////////////////////////START MODIFY DATASET/////////////////////////////

    /**
     * Generates a GUID.
     * @returns a string representing an id
    */
    generateId() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
      }

    rename(node, id) {
        if (this.findNodeById(id))
            return false;
        node.id = id;
        return true;
    }

    addNode(node) {
        if (this.findNodeById(node.id))
            return false;
        this.nodes.push(node);

        this.notifyObservers({nodes: this.nodes, links: this.links});

        return true;
    }

    addAnonymousNode(){
        var node = new GNode();
        var id = this.generateId();
        if (this.rename(node, id))
            this.addNode(node);
        return node;
    }

    removeNode(node) {
        let node_exists = this.nodes.length !== 0 && this.findNodeById(node.id);
        if (!node_exists) {
            return false;
        }
        let x_nodes = this.nodes.slice();
        let x_links = this.links.slice();
        this.nodes = x_nodes.filter(n => n.id !== node.id);
        let links_to_del = this.links.filter(e => e.source.id === node.id || e.target.id === node.id);
        links_to_del.forEach(e => this.removeLink(e));

        this.notifyObservers({nodes: this.nodes, links: this.links});

        return true;
    }

    // Each time a link is added, a reverse link is created and added too, to ensure bidirectionality.
    // A reference to the related link is kept as attribute in the main link.
    addLink(link) {
        let nodes_exists = this.findNodeById(link.source.id) && this.findNodeById(link.target.id);
        let link_already_exists = this.findLinkBetweenNodes(link.source, link.target);
        if (!nodes_exists || link_already_exists)
            return false;
        var link2 = new GLink(link.target, link.source);
        link2.isBackwardLink = true;
        this.links.push(link, link2); // to get bidirectionality

        this.notifyObservers({nodes: this.nodes, links: this.links});

        return true;
    }

    removeLink(link) {
        let x_links = this.links.slice();
        var link2 = this.findLinkBetweenNodes(link.target, link.source);
        this.links = x_links.filter(e => (e !== link) && (e !== link2));

        this.notifyObservers({nodes: this.nodes, links: this.links});

        return x_links.length != this.links.length;
    }

    reset() {
        this.nodes = [];
        this.links = [];
    }

    //////////////////////////////////END MODIFY DATASET//////////////////////////////



    /////////////////////////////////START QUERY DATASET//////////////////////////////

    findNodeById(id) {
        return this.nodes.find(n => id === n.id);
    }

    findNodeByLabel(label) {
        return this.nodes.filter(n => label === n.label);
    }

    findOutgoingLinks(startNode) {
        return this.links.filter(e => e.source === startNode) || [];
    }

    findForwardBranchingFactor(startNode) {
        return this.findOutgoingLinks(startNode).length;
    }

    findLinkBetweenNodes(node1, node2) {
        return this.links.find(e => (e.source === node1 && e.target === node2));
    }

    contains(node) {
        return this.findNodeById(node.id);
    }

    empty() {
        return this.nodes.lenght === 0;
    }

    findNodesByClassification(classification) {
        return this.nodes.filter(e => (e.classification === classification));
    }

    areAdjacentLinks(link1, link2) {
        return link1.target === link2.source || link1.source === link2.target;
    }

    findComplementaryLink(link){
        return this.findLinkBetweenNodes(link.target,link.source)
    }

    //////////////////////////////////END QUERY DATASET///////////////////////////////

    /////////////////////////////////////SUBJECT//////////////////////////////////////
    registerObserver(observer){
        this.observers.push(observer);
    }

    unregisterObserver(observer){
        this.observers = this.observers.filter(o => o !== observer);
    }

    notifyObserver(name, data){
        let observer = this.observers.find(o => o.name === name);
        observer.notify(data);
    }

    notifyObservers(data){
        this.observers.find(o => o.notify(data));
    }

}