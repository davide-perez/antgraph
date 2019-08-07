class EnvironmentController{

    constructor(nodes, edges){
        if(!nodes)
            nodes = [];
        if(!edges)
            edges = [];
        this.env = new Environment(nodes, edges);
    }


    nodes(){
        return this.env.nodes;
    }

    edges(){
        return this.env.edges;
    }

    addNodeToGraph(){
        this.env.addNode()
    }

    deleteNodeFromGraph(node){
        if(node)
            this.env.removeNode(node);
    }

    addEdgeToGraph(startNode, endNode){
        this.env.addEdgeToGraph(startNode, endNode);
    }

    deleteEdgeFromGraph(edge){
        this.env.removeEdge(edge);
    }


    data(){
        let n = this.nodes();
        let e = this.edges();
        return { nodes: n, links: e };
    }
    
    reset(){};
    save(){}; //databaseproxy?
    restore(){};




}