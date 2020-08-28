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
        if(this.constructor === AntColony){
            throw new Error('cannot instantiate abstract class')
        }

        this.environment = env;
        this.environment.registerObserverOnGraph(this);
        this.ants = null;
        this.position = this.environment.findNodesByClassification('start')[0];
        this.currentSolution = null;

        this.active = true;

        this.ONLINE_STEP_UPDATE = false;
        this.ONLINE_DELAYED_UPDATE = false;

        this.PHEROMONE = 0.2;
        this.EVAPORATION = 0.01;
        this.NO_OF_ANTS = 25;
        this.TICK_INTERVAL = 300;
        // this.NO_OF_ITERATIONS = Number.MAX_SAFE_INTEGER;
        this.NO_OF_ITERATIONS = Infinity;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;
        this.PHEROMONE_MAX_TRESHOLD = 100;
        this.MEMORYLESS_ANTS = false; // just remember last step. Ants remembery full path can perform delayed pheromone update.
        this.RANDOM_START = false; // every ant starts on a random position

        // set pheromone property on all links
        this.environment.addPropertyOnLinks('pheromone', 1);
        this.environment.addPropertyOnNodes('noOfAnts', 0);
    }


    initAnts(){
        this.ants = new Array(this.NO_OF_ANTS);
        var startPos = this.position;
        for(let i = 0; i < this.NO_OF_ANTS; i++){
            if(this.RANDOM_START)
                startPos = this.environment.selectRandomNode();
            let ant = {
                startPosition: startPos,
                position: startPos, 
                visited: [], 
                solution: [],
                alive: true, 
                foundSolution: false,
                retracing: false
            };
            this.ants[i] = ant;
        }
    }

    testSolution(){
        throw new Error('abstract function');
    }

    compareSolutions(solution1, solution2){
        throw new Error('abstract function');
    }

    // apply constraints, if needed
    updateRoutingTable(ant){
        throw new Error('abstract function');
    }

    // compute probabilities using routingTable, ant memory and other constraints if any
    applyProbabilisticRule(ant, routingTable){
        throw new Error('abstract function');
    }

    releasePheromone(){
        throw new Error('abstract function');
    }

    async ACOMetaHeuristic(){
        var i = 0;
        var that = this;

        this.initAnts();

        while(this.active && i < this.NO_OF_ITERATIONS){
            ACOMetaHeuristicStep();
            await new Promise(r => setTimeout(r, that.TIMEOUT));
            i++;
        }
        if(this.active)
            this.active = false;
        return this.currentSolution;



        function ACOMetaHeuristicStep(){
            // select alive ants only
            var ants = that.selectAnts(that.ants.filter(ant => ant.alive), that.SIZE_OF_SUBSET);
            // if no ants, prevent further processing
            if(ants.length === 0)
                that.active = false;
            var updates = new Array(ants.length);
            var canRetrace = that.ONLINE_DELAYED_UPDATE && !that.MEMORYLESS_ANTS;
            var i = 0;
            for(i = 0; i < ants.length; i++){
                let currentAnt = ants[i];
                // test solution
                if(!currentAnt.foundSolution){
                    if(that.testSolution(currentAnt)){
                        that.currentSolution = that.currentSolution ? that.compareSolutions(currentAnt.solution, that.currentSolution) : currentAnt.solution; // choose between the
                        currentAnt.foundSolution = true;
                        // best of two: the previous one or the new one found
                        if(canRetrace)
                            currentAnt.retracing = true;
                        else
                            currentAnt.alive = false;
                        continue;
                    }
                }

                let routingTable = that.updateRoutingTable(currentAnt);
                // Note that pheromone information is encapsulated in the link object:
                // no need of explictly building a routing table.

                // if ant is isolated, kill it
                if(routingTable.length === 0){
                    ant.alive = false;
                    continue;
                }
                               
                let link = null;
                // when retracing: attempt to re-do the path backwards.
                // the last link chosen is popped: if it is among the adjacent links, then it
                // is chosen. If not, then a dynamic change occured and the path
                // the ant built is no longer feasible, so another link is taken.
                if(currentAnt.retracing){
                    let lastVisited = currentAnt.visited.pop();
                    // if nothing to pop, then ant finished retracing. Ant dies.
                    if(!lastVisited){
                        currentAnt.alive = false;
                        if(currentAnt.position.noOfAnts > 0)
                            currentAnt.position.noOfAnts -= 1;
                        continue;
                    }
                    let preferredLink = that.environment.findComplementaryLink(lastVisited);
                    // following line is wrong. I need to check if the node still exists in graph. How to?
                    if(preferredLink)
                        link = preferredLink
                    else
                        currentAnt.retracing = false;
                }
                if(!link)
                    link = that.applyProbabilisticRule(currentAnt, routingTable);

                // move ant
                if(currentAnt.position.noOfAnts > 0)
                    currentAnt.position.noOfAnts -= 1;
                currentAnt.position = link.target;
                if(currentAnt.position)
                    currentAnt.position.noOfAnts += 1;

                // call the same method for updating pheromone when retracing, with additional param to know whether it
                // is retracing or not?

                // release pheromone. ACO algs exist that do not release any pheromone online.
                if(that.ONLINE_STEP_UPDATE || currentAnt.retracing){
                    let update = that.releasePheromone(currentAnt, link, that.PHEROMONE);
                    updates[i] = update;
                    that.environment.updateDirectionalParticles(that.PHEROMONE_MAX_TRESHOLD);
                }

                // update internal state (if necessary)
                if(!currentAnt.retracing){
                    if(!that.MEMORYLESS_ANTS)
                        currentAnt.visited.push(link)
                    else
                        currentAnt.visited[0] = link;
                }

                // construct solution
                if(!currentAnt.foundSolution)
                    currentAnt.solution.push(link);
            }
            that.pheromoneEvaporation();
            that.daemonActions();
            that.updatePheromones(updates);
        }
        
    }


    daemonActions(){
        throw new Error('abstract function');
    }

    pheromoneEvaporation(){
        this.environment.doEvaporation(this.EVAPORATION);
        // formula: (1 - this.EVAPORATION) * link.pheromone;        
    }

    updatePheromones(updates){
        updates.forEach(update => {
            // update of form {link, pheromoneQty}
            let link = update.link;
            let complementaryLink = controller.findComplementaryLink(link);
            if(link.pheromone < this.PHEROMONE_MAX_TRESHOLD)
                link.pheromone += update.pheromone;
            if(complementaryLink.pheromone < this.PHEROMONE_MAX_TRESHOLD)
                complementaryLink.pheromone += update.pheromone;
        });
    }


    // partial Fisher-Yates shuffle
    selectAnts(ants, sizeOfSubset){
        var selected = [];
        var l = ants.length;
        var taken = [];
        var n = sizeOfSubset < l && sizeOfSubset > 0 ? sizeOfSubset : l;
        while(n--){
            var k = Math.floor(Math.random()*l);
            selected[n] = ants[k in taken ? taken[k] : k];
            taken[k] = --l in taken ? taken[l] : l;
        }
        return selected;
    }

    notify(data){
        // add specific variables because they are not present at the moment of creation (add them to prototype instead?)
        this.environment.addPropertyOnNodes('noOfAnts', 0);
        this.environment.addPropertyOnLinks('pheromone', 1);
    }

    reset(){
        this.active = true;
        this.ants = null;
        this.currentSolution = null;
        this.environment.addPropertyOnLinks('noOfAnts', 0);
        this.environment.addPropertyOnNodes('pheromone', 1);
    }


}