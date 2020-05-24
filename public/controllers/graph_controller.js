// careful with graph vs multigraph
class GraphController {

    constructor(domElem, graph) {
        this.graph = graph || new Graph();
        this.renderer = new GraphEditor(domElem);
    }


    insertNode(label, id, classification) {
        label = label || '';
        id = id || this.generateId();
        classification = classification || 'normal';
        let node = new GNode(label);
        node.classification = classification;
        if (!this.graph.rename(node, id)) {
            throw new NamingError(id);
        };
        if (this.graph.addNode(node)) {
            this.renderer.update(this.graph);
        }
    }

    // solution to avoid undefined: insert default graph with some sample data
    insertNodeAt(label, id, classification, x, y) {
        label = label || '';
        id = id || this.graph.generateId();
        let node = new GNode(label);
        node.classification = classification || 'normal';
        if (!this.graph.empty() && (x && y)) {
            let pos = this.renderer.graphObj.screen2GraphCoords(x, y);
            node.x = pos.x;
            node.y = pos.y;
        }
        if (!this.graph.rename(node, id)) {
            throw new NamingError(id);
        };
        if (this.graph.addNode(node)) {
            this.renderer.update(this.graph);
        }
    }


    insertLink(startNode, endNode) {
        let link = new GEdge(startNode, endNode);
        //link.curvature = this.computeLinkCurvature(link);
        if (this.graph.addLink(link)) {
            this.renderer.update(this.graph);
        }
    }


    insertLinkFromUserSelection() {
        let selectedNodes = this.renderer.selectedNodes;
        if (selectedNodes.length !== 2)
            return;
        this.insertLink(selectedNodes[0], selectedNodes[1]);

    }


    deleteNodeFromUserSelection() {
        let selectedNodes = this.renderer.selectedNodes;
        if (selectedNodes.length !== 1)
            return;
        if (this.graph.removeNode(selectedNodes[0])) {
            this.renderer.update(this.graph);
            this.renderer.resetSelection();
        }
    }


    deleteLinkFromUserSelection() {
        let selectedLink = this.renderer.selectedLink;
        if (!selectedLink)
            return;
        if (this.graph.removeLink(selectedLink)) {
            this.renderer.update(this.graph);
            this.renderer.resetSelection();
        }
    }


    emitParticleAcrossSelectedLink() {
        let selectedLink = this.renderer.selectedLink;
        if (!selectedLink)
            return;
        this.renderer.emitParticle(selectedLink);
    }


    // refactor this in the dataset class?
    computeLinkCurvature(link) {
        let startNode = link.source;
        let endNode = link.target;
        let curveFactor = 0.0;
        // count edges from n1 to n2 and sum them to edges from n2 to n1
        let noOfLinks = this.graph.findLinksBetweenNodes(startNode, endNode).length + this.graph.findLinksBetweenNodes(endNode, startNode).length;
        if (noOfLinks !== 0)
            curveFactor = (noOfLinks % 2 == 0) ? 0.15 : -0.15;
        return curveFactor * noOfLinks;
    }

    // Passes the graph structure only, "striping out" unneccessary data such as functions.
    // Needed because web workers only accept object messages in such format.
    environment() {
        return { nodes: this.graph.nodes, links: this.graph.links };
    }


    // USE OBJECT DEFINE PROPERTY TO SET RULES FOR THIS ******** ID PLEASE
    // So that property cannot be assigned w/o enforcing some rules, because rename()
    // does not protect against misuses (node.id = somewrongval is still possible)

    /**
     * Generates a unique id code (wrt the application's domain) based on a timestamp and a random number.
     * @returns a string representing an id
     */

    generateId() {
        if (!Date.now) {
            Date.now = function () {
                return new Date().getTime();
            }
        }
        return "" + Math.round(Math.random() * Date.now());
    }
}
