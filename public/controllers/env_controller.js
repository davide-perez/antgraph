class EnvironmentController {

    constructor (env){
        this.env = env ? env : new Environment();
        console.log("Environment created.");
        console.log(this.env);

        
        this.renderer = null;
    }
}