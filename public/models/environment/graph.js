
//Class representing the graph model.
class Graph {

    constructor(nodes, links) {
        this.nodes = nodes || [];
        this.links = links || [];
        this.goals = [];
        this.start = [];
        this.evaporationRate = 0.0;
        //variables and params affecting the whole graph and all of the nodes

        //https://javascript.info/proxy 
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
        if (!id)
            id = this.generateId();
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
        return true;
    }

    addLink(link) {
        let nodes_exists = this.findNodeById(link.source.id) && this.findNodeById(link.target.id);
        if (!nodes_exists)
            return false;
        this.links.push(link);

        link.source.outgoingLinks = this.findOutgoingLinks(link.source);

        return true;
    }

    removeLink(link) {
        let x_links = this.links.slice();
        this.links = x_links.filter(e => e !== link);

        link.source.outgoingLinks = this.findOutgoingLinks(link.source);

        return x_links != this.links;
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

    findLinksBetweenNodes(node1, node2) {
        return this.links.filter(e => (e.source === node1 && e.target === node2));
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

    //////////////////////////////////END QUERY DATASET///////////////////////////////


}