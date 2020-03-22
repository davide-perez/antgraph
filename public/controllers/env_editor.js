class EnvironmentEditor {

    constructor(domElem){
        this.domElem = domElem;
        this.graphObj = ForceGraph();

    }

    update(dataset){
        this.graphObj(this.domElem)
        .cooldownTicks(0)
        .graphData(dataset);
    }



}