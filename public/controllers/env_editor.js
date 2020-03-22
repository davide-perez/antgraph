class EnvironmentEditor {

    constructor(domElem){
        this.domElem = domElem;
        this.graphObj = ForceGraph()
            .width(600)
            .height(400)
            .backgroundColor("yellow")
            .cooldownTicks(0);
        this.selectedNodes = [];

    }

    update(dataset){
        this.graphObj(this.domElem)
        .graphData(dataset);
    }



}