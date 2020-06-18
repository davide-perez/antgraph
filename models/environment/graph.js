
//Class representing the graph model.
class Graph {

    constructor(nodes, links) {
        this.nodes = nodes || [];
        this.links = links || [];

        /// SUBJECT ///
        this.observers = [];
    }

    //////////////////////////////////START MODIFY DATASET/////////////////////////////

    /**
     * Generates a unique id code (wrt the application's domain) based on a timestamp and a random number.
     * @returns a string representing an id
     */
    generateId() {
        if (!Date.now) {
            Date.now = function () { return new Date().getTime(); }
        }
        var id = "" + Math.round(Math.random() * Date.now());
        return id;

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
        node.outgoingLinks = this.findOutgoingLinks(node);

        this.notifyObservers({nodes: this.nodes, links: this.links});

        return true;
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

    addLink(link) {
        let nodes_exists = this.findNodeById(link.source.id) && this.findNodeById(link.target.id);
        let link_already_exists = this.findLinkBetweenNodes(link.source, link.target);
        if (!nodes_exists || link_already_exists)
            return false;
        var link2 = new GEdge(link.target, link.source);
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
        return this.links.filter(e => (e.classification === classification));
    }

    areAdjacentLinks(link1, link2) {
        return link1.target === link2.source || link1.source === link2.target;
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