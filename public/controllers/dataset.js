class Dataset {

    constructor(env){
        this.env = env;
        env.dataset = this;
        this.sync();
    }

    sync(){
        this.nodes = [];
        this.links = [];
        env.nodes.forEach(node => {
            this.nodes = [...this.nodes,{id:node.id}];
        });
        env.edges.forEach(edge => {
            this.links = [...this.links,{source:edge.source,target:edge.target}];
        });
    }
}