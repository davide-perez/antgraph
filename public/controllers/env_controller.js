class EnvironmentController {

    constructor (env){
        this.env = env || new Environment();
        console.log("Environment created.");
        this.dataset = new Dataset();
        this.dataset.sync(env);
        this.renderer = null;
    }

    addNode(label,id){
        label = label || '';
        let node = new GNode(label);
        if(id){
            if(!this.env.rename(node,id)){
                throw new NamingError(id);
            };
        }
        if(this.env.addNode(node)){
            this.dataset.translateNode(node);
        }
    }

    addEdge(edge){
        if(this.env.addEdge(edge)){
            this.dataset.translateEdge(edge);
        }
    }
}
//put here all the logic to construct nodes from scratch and handle errors. In the environment, let methods return true/false only for success/failure.