// when in report mode, disable graphics and dynamic changes.
class ReportingEngine {
    constructor (colony){
        this.colony = colony;
        this.iterations = 0;
        this.bestKnownSolution = null;
        this.solutions = null; // for all run take all solution from all ants
        this.totalAnts = 0;
    }

    async report(){
        var oldTimeout = this.colony.TIMEOUT;
        this.colony.TIMEOUT = 0;
        for(let i = 0; i <= this.iterations; i++){
            let currSolution = await this.colony.ACOMetaHeuristic();
            if(!currSolution)
                continue;
            let ants = this.colony.ants;
            this.totalAnts += ants.length;
            ants.forEach(ant => {
                this.solutions.push(ant.solution);    
            });
            this.colony.reset();
        }
        this.colony.TIMEOUT = oldTimeout;
        var totalSolutions = this.solutions.length;
        var noOfCorrectSolutions = 0;
        var percentageOfCorrectSolutions = 0;
        var noOfWrongSolutions = 0;
        var percentageOfWrongSolutions = 0;
        return this.bestKnownSolution;
    }

    reset(){
        this.colony.reset();
        this.iterations = 0;
        this.bestKnownSolution = null;
        this.solutions = null;
        this.totalAnts = 0;
    }

    // find the shortest path and use it as test to check how many times solution is found
    dijkstra(){
    }
}