//Class representing the environment model.
class Environment{

    constructor(nodes, edges){
        if(!nodes)
            nodes = [];
        if(!edges)
            edges = [];
        this.nodes = nodes;
        this.edges = edges;
        //variables and params affecting the whole graph and all of the nodes
    }

//////////////////////////////////START MODIFY DATASET/////////////////////////////

    addNode(node){
        if (!node)
            node = new GNode();
        this.nodes.push(node);
    }

    removeNode(node){
        this.nodes = this.nodes.filter(n => n !== node);
        this.edges = this.edges.filter(e => e.source !== node && e.target !== node);
    }

    addEdge(source, target){
        if(source && target){
            let edge = new GEdge(source, target)
            this.edges.push(edge);
        }
    }

    removeEdge(edge){
        this.edges = this.edges.filter(e => e !== edge);
    }

    clear(){
        this.nodes = [];
        this.edges = [];
    }


//////////////////////////////////END MODIFY DATASET//////////////////////////////


    getNodeById(id){
        return this.nodes.find(n => id === n.id);
    }

    getOutgoingEdges(node){
        return this.edges.filter(e => e.source === node);
    }

    getIncomingEdges(node){
        return this.edges.filter(e => e.target === node);
    }

    hasLoops(){
        this.edges.find(e => e.source === e.target);
        //base case
    }





    noOfNodes(){
        return this.nodes.lenght;
    }
    

    noOfLinks(){
        return this.nodes.lenght;
    }

}