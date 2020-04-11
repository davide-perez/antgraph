
//Class representing the environment model.
class Environment{

    constructor(nodes, edges){
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.goals = [];
        this.start = [];
        //variables and params affecting the whole graph and all of the nodes
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
       //console.log('Nodes now: ');
       //console.table(this.nodes);
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
        //15112019
        let edges_to_del = this.edges.filter(e => e.source.id === node.id || e.target.id === node.id);
        edges_to_del.forEach(e => this.removeEdge(e));
        //15112019
        /* this._edges = x_edges.filter(e => e.source !== node && e.target !== node);
        //if(this._edges.length !== x_edges.length){
        //    console.log("An edge has been removed.");
        //}
        */
        console.log("Node removed! Id: " + node.id + ", label:" + node.label);
        console.log("Nodes now:");
        console.table(this.nodes);
        return true;
    }

    addEdge(edge){
        let nodes_exists = this.findNodeById(edge.source.id) && this.findNodeById(edge.target.id);
        if(!nodes_exists)
            return false;
        this.edges.push(edge);
        return true;
    }
/*
    addEdge(source , target){
        let nodes_exists = this.findNodeById(source.id) && this.findNodeById(target.id);
        if(!nodes_exists)
            return false;
        this.edges.push(new GEdge(source,target));
        return true;
    }
*/
    removeEdge(edge){
        let x_edges = this.edges.slice();
        this.edges = x_edges.filter(e => e !== edge);
        console.log("Edge removed!");
        console.log("Edges first: ");
        console.table(x_edges);
        console.log("Edges now: ");
        console.table(this.edges);
        return x_edges != this.edges;
    }

    reset(){
        this.nodes = [];
        this.edges = [];
    }

    setupSampleData(){
        let n1 = new GNode('Node 1');
        let n2 = new GNode('Node 2');
        //n1.rename(this,'1');
        //n2.rename(this,'2');
        this.rename(n1, '1');
        this.rename(n2, '2');
        this.addNode(n1);
        this.addNode(n2);
        let e1 = new GEdge(n1,n2);
        this.addEdge(e1);
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
        return this.edges.filter(e => (e.source.id === node1.id && e.target.id === node2.id) || 
                                      (e.source.id === node2.id && e.target.id === node2.id)
                                );
    }

    contains(node){
        return this.findNodeById(node.id);
    }

    empty(){
        return this.nodes.lenght === 0;
    }

//////////////////////////////////END QUERY DATASET///////////////////////////////


}