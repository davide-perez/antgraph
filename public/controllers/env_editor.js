class EnvironmentEditor {

    constructor(domElem){
        this.dataset = null;
        this.setNewEnvironment();
        this.graphObj = ForceGraph()(domElem)
                        .graphData(this.dataset);
    }

    setNewEnvironment(env){
        this.dataset = new Dataset();
        this.environment = env || new Environment();
        this.dataset.sync(this.environment);
    }



}