class AntBase {

    constructor(colony){
        this.colony = colony;
        this.startPosition = null;
        this.position = null;
        this.visited = [];
        this.solution = [];
        this.alive = true;
        this.foundSolution = false;
        this.retracing = false;
    }
}