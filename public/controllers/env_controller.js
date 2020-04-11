class EnvironmentController {

    constructor (domElem,env){
        this.env = env || new Environment();
        console.log("Environment created.");
        this.dataset = new Dataset();
        this.dataset.sync(env);
        this.renderer = new EnvironmentEditor(domElem);
    }

    insertNode(label,id){
        label = label || '';
        id = id || this.generateId();
        let node = new GNode(label)
        if(!this.env.rename(node,id)){
            throw new NamingError(id);
        };
        if(this.env.addNode(node)){
            this.dataset.addNode(node);
            this.renderer.update(this.dataset);
        }
    }

    insertEdge(startNode,endNode){
        let edge = new GEdge(startNode,endNode);
        if(this.env.addEdge(edge)){
            let curvature = this.computeEdgeCurvature(edge);
            this.dataset.addEdge(edge,curvature);
            this.renderer.update(this.dataset);
        }
    }


    insertEdgeFromUserSelection(){
        let selectedNodes = this.renderer.selectedNodes;
        if(selectedNodes.length !== 2)
            return;
        this.insertEdge(selectedNodes[0],selectedNodes[1]);
        
    }


    deleteNodeFromUserSelection(){
        let selectedNodes = this.renderer.selectedNodes;
        if(selectedNodes.length !== 1)
            return;
        if(this.env.removeNode(selectedNodes[0])){
            this.dataset.removeNode(selectedNodes[0]);
            this.renderer.update(this.dataset);
            this.renderer.resetSelection();
        }
    }


    deleteEdgeFromUserSelection() {
        let selectedEdge = this.renderer.selectedEdge;
        if(!selectedEdge)
            return;
        if(this.env.removeEdge(selectedEdge)){
            this.dataset.removeLink(selectedEdge);
            this.renderer.update(this.dataset);
            this.renderer.resetSelection();
        }
    }

    computeEdgeCurvature(edge){
        let startNode = edge.source;
        let endNode = edge.target;
        let curveFactor = 0.0;
        // count edges from n1 to n2 and sum them to edges from n2 to n1
        let noOfEdges = this.env.findEdgesBetweenNodes(startNode,endNode).length + this.env.findEdgesBetweenNodes(endNode,startNode).length;
        if (noOfEdges !== 1)
            curveFactor = (noOfEdges % 2 == 0) ? 0.15 : - 0.15;
        return curveFactor * noOfEdges;
    }

    // USE OBJECT DEFINE PROPERTY TO SET RULES FOR THIS ******** ID PLEASE
    // So that property cannot be assigned w/o enforcing some rules, because rename()
    // does not protect against misuses (node.id = somewrongval is still possible)

    /**
     * Generates a unique id code (wrt the application's domain) based on a timestamp and a random number.
     * @returns a string representing an id
     */

    generateId(){
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        return "" + Math.round(Math.random() * Date.now());
    }


}
//put here all the logic to construct nodes from scratch and handle errors. In the environment, let methods return true/false only for success/failure.