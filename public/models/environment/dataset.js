class Dataset {

    constructor(){
        this.sync();
    }

    translateNode(node){
        this.nodes = [...this.nodes,{id: node.id}];
    }

    translateEdge(edge){
        this.links = [...this.links,{source: edge.source, target: edge.target}];
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