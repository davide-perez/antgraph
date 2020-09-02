// when in report mode, disable graphics and dynamic changes.
class ReportingEngine {
    constructor(colony) {
        this.colony = colony;
        this.iterations = 0;
        this.bestKnownSolution = null;
        this.solutions = null; // for all run take all solution from all ants
        this.totalAnts = 0;
    }

    async report() {
        var oldTimeout = this.colony.TIMEOUT;
        this.colony.TIMEOUT = 0;
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
        var totalSolutions = this.solutions.length;
        var noOfCorrectSolutions = 0;
        var percentageOfCorrectSolutions = 0;
        var noOfWrongSolutions = 0;
        var percentageOfWrongSolutions = 0;
        return this.bestKnownSolution;
    }

    reset() {
        this.colony.reset();
        this.iterations = 0;
        this.bestKnownSolution = null;
        this.solutions = null;
        this.totalAnts = 0;
    }

    djikstraAlgorithm(graph) {
        var nodes = graph.nodes;
        var links = graph.links;
        var startNode = nodes.find(n => n.classification === 'start');
        var goalNode = nodes.find(n => n.classification === 'goal');
        var queue = [];
        if(!startNode || !goalNode)
            return null;
        var distances = nodes.map(node =>{
            let dist = node.classification !== 'start' ? Infinity : 0;
            return {node: node, previous: null, distance: dist}
        });
        queue.push(distances.find(d => d.node.classification === 'start'));

        while (queue.length > 0) {
            let currNode = queue.shift();
            let weight = minNode.priority;
            let neighbours = findNeighbours(currNode);
            let outgoingLinks = outgoingLinks(node);
            outgoingLinks.forEach(neighbor => {
                let alt = distances[currNode] + neighbor.weight;
                if (alt < distances[neighbor.node]) {
                    distances[neighbor.node] = alt;
                    prev[neighbor.node] = currNode;
                    pq.enqueue(neighbor.node, distances[neighbor.node]);
                }
            });
        }
        return distances;

        function outgoingLinks(node){
            return links.filter(link => link.source === node);
        }


        function findNeighbours(node){
            var outgoingLinks = outgoingLinks(node);
            return nodes.filter(node => outgoingLinks.find(link => link.target === node));
        }


    }
}