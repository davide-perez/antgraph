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
        this.environment = env;
        this.environment.registerObserverOnGraph(this);

        this.position = this.environment.findNodesByClassification('start')[0];
        this.policy = null;
        this.currentSolution = null;

        this.active = true;

        this.PHEROMONE = 0.2;
        this.EVAPORATION = 0.01;
        this.NO_OF_ANTS = 1;
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

    run() {
        this.initAnts();

        var i = 0;
        var that = this;
        ACOMetaHeuristic(i);

        // needed to loop the function n times with a fixed interval
        function ACOMetaHeuristic(i) {
            setTimeout(function () {
                that.ACOMetaHeuristicStep();
                if (that.active && i < that.NO_OF_ITERATIONS) {
                    i++;
                    ACOMetaHeuristic(i);
                }
            }, that.TIMEOUT);
        }
    }

    // TODO: algorithm to place ants at a starting position should be defined in policies? Or give
    // a configuration such as "random start" to randomize?

    // "polymorphic" algorithm. This algorithm lets the implementation to the active policy,
    // letting full personalization to every step.
    // JS lacks interfaces, so duck typing will suffice: it is sufficient that the strategy class
    // implements the required methods (with the right signature, otherwise undefined errors will rise)
    // Represents a single step of the algorithm: all ants move by a single step.
    // problem: when coming back, pheromone should be added to the main link only.
    ACOMetaHeuristicStep(){
        // select alive ants only
        var ants = this.selectAnts(this.ants.filter(ant => ant.alive), this.SIZE_OF_SUBSET);
        // if no ants, prevent further processing
        if(ants.length === 0)
            this.active = false;
        var updates = new Array(ants.length);
        var canRetrace = this.policy.testOnlineDelayedPheromoneUpdate() && !this.MEMORYLESS_ANTS;
        var i = 0;
        for(i = 0; i < ants.length; i++){
            let currentAnt = ants[i];
            // if ant is retracing and there are no visited nodes, it means it has finished
            if(currentAnt.retracing && currentAnt.visited === []){
                currentAnt.alive = false;
                continue;
            }
            // test solution
            if(!currentAnt.foundSolution){
                if(this.policy.testSolution(currentAnt)){
                    this.currentSolution = this.currentSolution ? this.policy.compareSolutions(currentAnt.solution, this.currentSolution) : currentAnt.solution; // choose between the
                    currentAnt.foundSolution = true;
                    // best of two: the previous one or the new one found
                    console.log('Solution is now: ');
                    console.table(currentAnt.solution);
                    if(canRetrace)
                        currentAnt.retracing = true;
                    else
                        currentAnt.alive = false;
                    continue;
                }
            }

            let antPosition = currentAnt.position;
            // retracing could not always be successful, because path may vary and visited nodes may exist no more.
            // if retracing is active, ant attempts to give priority to retrace the path memorized. if not possible,
            // switches to standard.
            let outgoingLinks = this.environment.findOutgoingLinks(antPosition);
            // if ant is isolated, kill it
            if(outgoingLinks.length === 0){
                currentAnt.alive = false;
                continue;
            }
            // >> HERE SHOULD HAPPEN A BIG MODIFICATION
            // find links that can be taken. Exclude the last visited one
            let routingTable = outgoingLinks.filter((link) => {
                let lastVisited = currentAnt.visited[currentAnt.visited.length - 1]
                // if no last visited link, then ant still has to start
                if(!lastVisited)
                    return true;
                return (link !== lastVisited) && (link !== this.environment.findComplementaryLink(lastVisited))
            });
            // << HERE SHOULD HAPPEN A BIG MODIFICATION
            // if no adjacent link is found, include the visited one
            if(routingTable.length === 0)
                routingTable = outgoingLinks;
            // calculation is deferred to the current policy.
            // Note that pheromone information is encapsulated in the link object:
            // no need of explictly building a routing table.
            // chooseNextLink is a combination of compute_transition_probabilities and apply_ant_decision_policy.
            
            let link = null;
            // when retracing: attempt to re-do the path backwards.
            // the last link chosen is popped: if it is among the adjacent links, then it
            // is chosen. If not, then a dynamic change occured and the path
            // the ant built is no longer feasible, so another link is taken.
            if(currentAnt.retracing){
                let lastVisited = currentAnt.visited.pop();
                let preferredLink = this.environment.findComplementaryLink(lastVisited);
                // following line is wrong. I need to check if the node still exists in graph. How to?
                if(preferredLink)
                    link = preferredLink
                else
                    currentAnt.retracing = false;
            }
            if(!link)
                link = this.policy.chooseNextLink(currentAnt, routingTable);

            // move ant
            if(currentAnt.position.noOfAnts > 0)
                currentAnt.position.noOfAnts -= 1;
            currentAnt.position = link.target;
            if(currentAnt.position)
                currentAnt.position.noOfAnts += 1;

            // call the same method for updating pheromone when retracing, with additional param to know whether it
            // is retracing or not?

            // release pheromone. ACO algs exist that do not release any pheromone online.
            if(this.policy.testOnlineStepPheromoneUpdate() || currentAnt.retracing){
                let update = this.policy.releasePheromone(currentAnt, link, this.PHEROMONE);
                updates[i] = update;
                this.environment.updateDirectionalParticles(this.PHEROMONE_MAX_TRESHOLD);
            }

            // update internal state
            if(!this.MEMORYLESS_ANTS)
                currentAnt.visited.push(link)
            else
                currentAnt.visited[0] = link;

            // construct solution
            currentAnt.solution.push(link);
        }
        this.pheromoneEvaporation();
        this.daemonActions();
        this.updatePheromones(updates);

        return ants;
    }
    

    daemonActions(){
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

    setPolicy(policy){
        this.policy = policy;
    }

    reset(){
        this.active = true;
        this.environment.addPropertyOnLinks('noOfAnts', 0);
        this.environment.addPropertyOnNodes('pheromone', 1);
    }


}