// current problem: 
// each edge is composed by two edges, to get bidirectionality.
// Ants tend to move forward towards the goal. They lay pheromone on the edge they pass through, but only on forward node!
// Ants skip last visited node, unless it is the only choice they have.
// If an ant is on a node that is either isolated or deleted, then it starts from start position again. 

// Problem: for newly added links, pheromone is NaN because property does not exist. Same for nodes ant noOfAnts.
// Problem #2: noOfAnts is evaluated incorrectly (seems more like a counter)
// Problem #3: looks like a property cannot be added easily on an existing constructor. So this approach I used is motivated.

// NOTE: a memoryless, immortal ant is not the same as an ant with retracing capability! Retracing follows the same path,
// a memoryless ant still chooses stochastically 

class AntColony {

    constructor(env) {
        if (this.constructor === AntColony) {
            throw new Error('cannot instantiate abstract class')
        }

        this.environment = env;
        this.environment.registerObserverOnGraph(this);
        this.ants = null;
        this.position = this.environment.findNodesByClassification('start')[0];

        this.active = false;
        this.currentIterationNo = 0;
    }


    initAnts() {
        this.ants = new Array(NO_OF_ANTS);
        var startPos = this.position;
        for (let i = 0; i < NO_OF_ANTS; i++) {
            let ant = this.createAnt(startPos);
            ant.index = i;
            this.ants[i] = ant;
        }
    }

    createAnt(startPos) {
        let ant = {
            index: -1,
            position: startPos,
            lastVisited: null,
            alive: true,
            foundSolution: false
        };

        return ant;
    }

    testSolution() {
        throw new Error('abstract function');
    }

    compareSolutions(solution1, solution2) {
        throw new Error('abstract function');
    }

    // apply constraints, if needed
    updateRoutingTable(ant) {
        throw new Error('abstract function');
    }

    // compute probabilities using routingTable, ant memory and other constraints if any
    applyProbabilisticRule(ant, routingTable) {
        throw new Error('abstract function');
    }

    async ACOMetaHeuristic() {
        var that = this;
        this.active = true;

        this.initAnts();

        while (this.active && this.currentIterationNo < NO_OF_ITERATIONS) {
            ACOMetaHeuristicStep();
            await new Promise(r => setTimeout(r, TIMEOUT));
            this.currentIterationNo++;
        }
        if (this.active)
            this.active = false;


        function ACOMetaHeuristicStep() {
            // select alive ants only
            //var ants = that.selectAnts(that.ants.filter(ant => ant.alive), that.SIZE_OF_SUBSET);
            var ants = that.selectAnts(that.ants.filter(ant => ant.alive), SIZE_OF_SUBSET);
            var updates = [];

            // if no ants, prevent further processing
            if (ants.length === 0)
                that.active = false;
            var i = 0;
            for (i = 0; i < ants.length; i++) {
                let currentAnt = ants[i];

                if (RANDOM_PURGE) {
                    that.testPurge(currentAnt);
                }

                // test solution - todo

                let routingTable = that.updateRoutingTable(currentAnt);
                // Note that pheromone information is encapsulated in the link object:
                // no need of explictly building a routing table.

                // if ant is insulated, skip
                if (routingTable.length === 0)
                    continue;

                let link = that.applyProbabilisticRule(currentAnt, routingTable);

                // move ant
                if (currentAnt.position.noOfAnts > 0)
                    currentAnt.position.noOfAnts -= 1;
                currentAnt.position = link.target;
                if (currentAnt.position)
                    currentAnt.position.noOfAnts += 1;


                // release pheromone
                let update = that.releasePheromone(link, PHEROMONE_UNIT);
                updates.push(update);


                currentAnt.lastVisited = link;

                that.environment.updateLinkWidth();
                that.environment.updateNodeColor();

            }

            that.pheromoneEvaporation();
            that.daemonActions();
            that.updatePheromones(updates);
        }

    }


    daemonActions() {
        throw new Error('abstract function');
    }


    pheromoneEvaporation() {
        throw new Error('abstract function');
    }

    updateRoutingTable(ant) {
        var antPosition = ant.position;

        var outgoingLinks = this.environment.findOutgoingLinks(antPosition);
        // find links that can be taken. Exclude the last visited one
        var routingTable = outgoingLinks.filter((link) => {
            let lastVisited = ant.lastVisited;
            // if no last visited link, then ant still has to start
            if (!ant.lastVisited)
                return true;
            return (link !== this.environment.findComplementaryLink(lastVisited))
        });
        // if no adjacent link is found, include the visited one
        if (routingTable.length === 0)
            routingTable = outgoingLinks;

        return routingTable;
    }

    releasePheromone(link, totalPheromone) {
        // path here is an object of form {link}. All pheromone goes on the single edge. In canonical formula, length matters: 1/link.length
        // required to release an object of such form, where on each link is specified how much pheromone to deposit
        return { link: link, pheromone: totalPheromone };

    }


    updatePheromones(updates) {
        updates.forEach(update => {
            // update of form {link, pheromoneQty}
            let link = update.link;
            let complementaryLink = controller.findComplementaryLink(link);
            if (link.pheromone < PHEROMONE_MAX_TRESHOLD)
                link.pheromone += update.pheromone;
            if (complementaryLink.pheromone < PHEROMONE_MAX_TRESHOLD)
                complementaryLink.pheromone += update.pheromone;
        });
    }


    // partial Fisher-Yates shuffle
    selectAnts(ants, sizeOfSubset) {
        if (NO_OF_ANTS_AS_UPPERBOUND) {
            sizeOfSubset = this.getRandomInt(1, sizeOfSubset);
        }
        var selected = [];
        var l = ants.length;
        var taken = [];
        var n = sizeOfSubset < l && sizeOfSubset > 0 ? sizeOfSubset : l;
        while (n--) {
            var k = Math.floor(Math.random() * l);
            selected[n] = ants[k in taken ? taken[k] : k];
            taken[k] = --l in taken ? taken[l] : l;
        }
        return selected;

    }

    testPurge(ant) {
        if (this.getRandomInt(1, 100) <= PURGE_PROBABILITY)
            this.killAnt(ant);
    }

    killAnt(ant) {
        if (ant.alive === false)
            return;
        ant.alive = false;
        let antPos = ant.currentPosition;
        if (antPos.noOfAnts > 0)
            antPos.noOfAnts -= 1;
    }


    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }


    notify(data) {
    }

    reset() {
        this.active = false;
        this.ants = null;
        this.currentSolution = null;
        this.currentIterationNo = 0;
        this.environment.reset();
    }


}