class EnvironmentController {

    constructor (env){
        this.env = env ? env : new Environment();
        console.log("Environment created.");
        console.log(this.env);

        
        this.renderer = null;
    }

    //////////////////////////////////START MODIFY DATASET/////////////////////////////

    addNode(node){
        let nodes = this.env.nodes;
        if (!node)
            node = new GNode();
        nodes.push(node);

        console.log('New value of nodes:');
        console.log(this.env.nodes);
    }

    removeNode(node){
        let nodes = this.env.nodes;
        let edges = this.env.edges;
        nodes.filter(n => n !== node);
        edges = edges.filter(e => e.source !== node && e.target !== node);
        console.log('Nodes removed. New value:');
        console.log(this.env.edges);
    }

    addEdge(source , target){
        if(source && target){
            let edge = new GEdge(source, target)
            this.env.edges.push(edge);
        }
    }

    removeEdge(edge){
        let edges = this.env.edges;
        edges = edges.filter(e => e !== edge);
    }

    clear(){
        this.env.nodes = [];
        this.env.edges = [];
    }


    //////////////////////////////////END MODIFY DATASET//////////////////////////////

    findNodeById(id){
        return this.env.nodes.find(n => id === n.id);
    }

    contains(node){
        return this.findNodeById(node.id);
    }
}