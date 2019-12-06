class EnvironmentController {

    constructor (env){
        this.env = env || new Environment();
        console.log("Environment created.");
        
        this.renderer = null;
    }

    addNode(label,id){
        let label = label || '';
        let node = new GNode(label);
        if(id){
            this.env.rename(node,id);
        }
        if(!this.env.addNode(node))

    }
}

//put here all the logic to construct nodes from scratch and handle errors. In the environment, let methods return true/false only for success/failure.