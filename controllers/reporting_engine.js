// when in report mode, disable graphics and dynamic changes.
class ReportingEngine {
    constructor(colony) {
        this.colony = colony;
        this.iterations = 3;
        this.bestSolutionComputed = null;
        this.solutions = []; // for all run take all solution from all ants
        this.totalAnts = 0;

        this.noOfBestSolutions = 0;
        this.noOfWrongSolutions = 0;
    }

    async report() {
        this.bestSolutionComputed = this.bfs(colony.environment.getGraphComponents());
        if(!this.bestSolutionComputed){
            alert('Reporting error: cannot compute a solution for this graph.');
            return null;
        }
        var oldTimeout = this.colony.TIMEOUT;
        this.colony.TIMEOUT = 0;
        showWaitDialog('Reporting...');
        for (let i = 0; i <= this.iterations; i++) {
            let currSolution = await this.colony.ACOMetaHeuristic();
            if (!currSolution)
                continue;
            let ants = this.colony.ants;
            this.totalAnts += ants.length;
            ants.forEach(ant => {
                this.solutions.push(ant.solution);
            });
            this.colony.reset();
        }
        this.colony.TIMEOUT = oldTimeout;
        this.computeResults();
        hideWaitDialog();
    }

    computeResults(){
        this.solutions.forEach(s => {
            if(this.areSolutionsEqual(s,this.bestSolutionComputed))
                this.noOfBestSolutions++
            else
                this.noOfWrongSolutions++;
        })
        alert('On a total of ' + this.solutions.length + ' solution found complessively with ' + this.iterations + ' runs of ' + colony.name + ' ,  ' + this.noOfBestSolutions + ' ants found the optimal solution');
    }

    areSolutionsEqual(s1, s2){
        if(s1.length !== s2.length)
            return false;
        for(let i = 0; i < s1.length; i++){
            if(s1[i] !== s2[i])
                return false;
        }
        return true;
    }

    reset() {
        this.colony.reset();
        this.iterations = 0;
        this.bestSolution = null;
        this.solutions = null;
        this.totalAnts = 0;
    }

    bfs(graph){
        var nodes = graph.nodes;
        var links = graph.links;
        var startNode = nodes.find(node => node.classification === 'start');
        var goalNode = graph.nodes.find(node => node.classification === 'goal');
        if(!startNode || !goalNode)
            return null;
        var queue = [];
        findAdjacentLinks(startNode).forEach(link => {
            queue.push([link]);
        });

        while(true) {
            let currPath = queue.shift();
            let lastLink = currPath[currPath.length - 1];
            if(!lastLink)
                return null;
            let lastNode = lastLink.target;
            if(lastNode === goalNode)
                return currPath;
            let adjLinks = findAdjacentLinks(lastNode);
            adjLinks.forEach(link => {
                let newPath = currPath.slice();
                newPath.push(link);
                queue.push(newPath);
            })
        }


        function findAdjacentLinks(node){
            return links.filter(link => link.source === node);
        }


    }
}