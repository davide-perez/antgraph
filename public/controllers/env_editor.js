class EnvironmentEditor {

    constructor(domElem){
        this.domElem = domElem;
        this.graphObj = ForceGraph()(domElem)
                        .graphData();
    }

    update(dataset){
        const Graph = this.graphObj = ForceGraph()(this.domElem).graphData(dataset);
        Graph.graphData(dataset);
        this.graphObj = Graph;
    }



}