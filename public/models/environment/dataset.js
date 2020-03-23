class Dataset {

    constructor(){
        this.sync();
    }

    addNode(node){
        this.nodes = [...this.nodes,{id: node.id}];
    }

    addEdge(edge){
        this.links = [...this.links,{source: edge.source.id, target: edge.target.id}];
    }

    removeNode(node){

    }

    removeEdge(edge){

    }

    getNode(id){
        return this.nodes.find(n => n.id === id);
    }

    getEdgesBetween(id1, id2){
        if(!(getNode(id1) && this.getNode(id2)))
            return null;
        return this.links.filter(e =>{
            ((source.id === id1 && target.id === id2) || (source.id === id2 && target.id === id1))
        });
    }

    sync(env){
        this.env = env;
        this.nodes = [];
        this.links = [];
        if(!env)
            return;
        env.nodes.forEach(node => {
            this.nodes = [...this.nodes,{id:node.id}];
        });
        env.edges.forEach(edge => {
            this.links = [...this.links,{source:edge.source.id,target:edge.target.id}];
        });
        this.print();
    }

    print(){
        console.log("***DATASET OBJECT***");
        console.log("Nodes: ");
        console.table(this.nodes);
        console.log("Edges: ");
        console.table(this.links);
        console.log("********************");
    }


}