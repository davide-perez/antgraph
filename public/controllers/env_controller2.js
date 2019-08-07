class EnvironmentController{

    constructor(nodes, edges){
        if(!nodes)
            nodes = [];
        if(!edges)
            edges = [];
        this.env = new Environment(nodes, edges);
    }



    getNodes(){
        return this._env.nodes;
    };
    getEdges(){
        return this._env.edges;
    }
    addNode(id){
        var nodes = this.env.nodes;
        var nodeToAdd = new GNode(id);
        nodes.push(nodeToAdd);
    };
    deleteNode(currNode){
        let nodes = this.env.nodes;
        let edges = this.env.edges;
        if(currNode){
            edges = edges.filter(e => e.source !== node && e.target !== node);
            nodes.splice(nodes.indexOf(currNode),1);
        }
    
    };
    addEdge(edge){
        let edges = this.env.edges;
        if(edge.source && edge.target)
            edges.push(edge);
    };
    deleteEdge(){

    };


    fetchData(){
        return { nodes: this.env.nodes, links: this.env.edges };
    }
    
    reset(){};
    save(){}; //databaseproxy?
    restore(){};




}