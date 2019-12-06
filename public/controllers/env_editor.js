class EnvironmentEditor {

    constructor(domElem, env){
        this.environment = env || new Environment();
        this.graphObj = ForceGraph()(domElem)
                        .graphData();
    }



}