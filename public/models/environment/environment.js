
//Class representing the environment model.
class Environment{

    constructor(nodes, edges){
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.goals = [];
        this.start = [];
        //variables and params affecting the whole graph and all of the nodes

        this.dataset = new Dataset();
    }

   //////////////////////////////////START MODIFY DATASET/////////////////////////////

    /**
     * Generates a unique id code (wrt the application's domain) based on a timestamp and a random number.
     * @returns a string representing an id
     */
    generateId(){
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        var id = "" + Math.round(Math.random() * Date.now());
        return id;

    }

    rename(node, id){
        if(!id)
            id = this.generateId();
        if(this.findNodeById(id))
            return false;
        node.id = id;
        return true;
    }


   addNode(node){
       if(this.findNodeById(node.id))
            return false;
       this.nodes.push(node);
       this.dataset.addNode(node);
       return true;
    }

    removeNode(node){
        let node_exists = this.nodes.length !== 0 && this.findNodeById(node.id);
        if(!node_exists){
            return false;
        }
        console.log("Node first: ");
        console.table(this.nodes);
        let x_nodes = this.nodes.slice();
        let x_edges = this.edges.slice();
        this.nodes = x_nodes.filter(n => n.id !== node.id);
        let edges_to_del = this.edges.filter(e => e.source.id === node.id || e.target.id === node.id);
        this.dataset.removeNode(node);
        edges_to_del.forEach(e => this.removeEdge(e));
        return true;
    }

    addEdge(edge){
        let nodes_exists = this.findNodeById(edge.source.id) && this.findNodeById(edge.target.id);
        if(!nodes_exists)
            return false;
        this.edges.push(edge);
        this.dataset.addLink(edge)
        return true;
    }

    removeEdge(edge){
        let x_edges = this.edges.slice();
        this.edges = x_edges.filter(e => e !== edge);
        this.dataset.removeLink(edge);
        return x_edges != this.edges;
    }

    reset(){
        this.nodes = [];
        this.edges = [];
    }

//////////////////////////////////END MODIFY DATASET//////////////////////////////



    /////////////////////////////////START QUERY DATASET//////////////////////////////

    findNodeById(id){
        return this.nodes.find(n => id === n.id);
    }

    findNodeByLabel(label){
        return this.nodes.filter(n => label === n.label);
    }

    findOutgoingEdges(startNode){
        return this.edges.filter(e => e.source === startNode) || [];
    }

    findForwardBranchingFactor(startNode){
        return this.findOutgoingEdges(startNode).length;
    }

    findEdgesBetweenNodes(node1,node2){
        return this.edges.filter(e => (e.source === node1 && e.target === node2));
    }

    contains(node){
        return this.findNodeById(node.id);
    }

    empty(){
        return this.nodes.lenght === 0;
    }

//////////////////////////////////END QUERY DATASET///////////////////////////////


}