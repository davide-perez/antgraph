// careful with graph vs multigraph
class EnvironmentController {

    constructor(domElem, env) {
        this.env = env || new Environment();
        this.renderer = new EnvironmentEditor(domElem);
    }


    insertNode(label, id) {
        label = label || '';
        id = id || this.generateId();
        let node = new GNode(label)
        if (!this.env.rename(node, id)) {
            throw new NamingError(id);
        };
        if (this.env.addNode(node)) {
            this.renderer.update(this.env);
        }
    }

    // solution to avoid undefined: insert default graph with some sample data
    insertNodeAt(label, id, x, y) {
        label = label || '';
        id = id || this.env.generateId();
        let node = new GNode(label);
        if (!this.env.empty() && (x && y)) {
            let pos = this.renderer.graphObj.screen2GraphCoords(x, y);
            node.x = pos.x;
            node.y = pos.y;
        }
        if (!this.env.rename(node, id)) {
            throw new NamingError(id);
        };
        if (this.env.addNode(node)) {
            this.renderer.update(this.env);
        }
    }


    insertLink(startNode, endNode) {
        let link = new GEdge(startNode, endNode);
        link.curvature = this.computeLinkCurvature(link);
        if (this.env.addLink(link)) {
            this.renderer.update(this.env);
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
        if (this.env.removeNode(selectedNodes[0])) {
            this.renderer.update(this.env);
            this.renderer.resetSelection();
        }
    }


    deleteLinkFromUserSelection() {
        let selectedLink = this.renderer.selectedLink;
        if (!selectedLink)
            return;
        if (this.env.removeLink(selectedLink)) {
            this.renderer.update(this.env);
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
        let noOfLinks = this.env.findLinksBetweenNodes(startNode, endNode).length + this.env.findLinksBetweenNodes(endNode, startNode).length;
        if (noOfLinks !== 0)
            curveFactor = (noOfLinks % 2 == 0) ? 0.15 : -0.15;
        return curveFactor * noOfLinks;
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
//put here all the logic to construct nodes from scratch and handle errors. In the environment, let methods return true/false only for success/failure.