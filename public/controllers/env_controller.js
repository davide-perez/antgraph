class EnvironmentController {

    constructor (env){
        this.env = env || new Environment();
        console.log("Environment created.");
        
        this.renderer = null;
    }

    
}