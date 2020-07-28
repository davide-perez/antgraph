// current problem: 
// each edge is composed by two edges, to get bidirectionality.
// Ants tend to move forward towards the goal. They lay pheromone on the edge they pass through, but only on forward node!
// Ants skip last visited node, unless it is the only choice they have.
// If an ant is on a node that is either isolated or deleted, then it starts from start position again. 

// Problem: for newly added links, pheromone is NaN because property does not exist. Same for nodes ant noOfAnts.
// Problem #2: noOfAnts is evaluated incorrectly (seems more like a counter)
// Problem #3: looks like a property cannot be added easily on an existing constructor. So this approach I used is motivated.

class AntColony {

    constructor(env) {
        this.environment = env;
        this.environment.registerObserverOnGraph(this);

        this.position = this.environment.findNodesByClassification('nest')[0];
        this.policy = null;

        this.PHEROMONE = 0.4;
        this.EVAPORATION = 0.01;
        this.NO_OF_ANTS = 10;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 500;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 3;
        this.PHEROMONE_MAX_TRESHOLD = 100;

        // set pheromone property on all links
        this.environment.addPropertyOnLinks('pheromone', 1);
        this.environment.addPropertyOnNodes('noOfAnts', 0);

    }


    initAnts(){
        this.ants = new Array(this.NO_OF_ANTS);
        var startPos = this.position;
        for(let i = 0; i < this.NO_OF_ANTS; i++){
            let ant = {position: startPos, goalType: 'food', lastVisited: null};
            this.ants[i] = ant;
        }
        console.log('Ants created.');
    }

    run() {
        this.initAnts();

        var i = 0;
        var that = this;
        console.log('ACO starting with %s policy', this.policy.name)
        doACO(i);

        // needed to loop the function n times with a fixed interval
        function doACO(i) {
            setTimeout(function () {
                that.ACO();
                if (i < that.NO_OF_ITERATIONS) {
                    i++;
                    console.log('======================== ITERATION ' + i + ' ========================');
                    doACO(i);
                    console.log('========================================================================')
                }
            }, that.TIMEOUT);
        }

        console.log('ACO completed: ' + this.NO_OF_ITERATIONS + ' iterations.');
    }

    // "polymorphic" algorithm. This algorithm lets the implementation to the active policy,
    // letting full personalization to every step.
    // JS lacks interfaces, so duck typing will suffice: it is sufficient that the strategy class
    // implements the required methods (with the right signature, otherwise undefined errors will rise)
    // Represents a single step of the algorithm: all ants move by a single step.
    // problem: when coming back, pheromone should be added to the main link only.
    ACO(){
        var ants = this.policy.selectAnts(this.ants, this.SIZE_OF_SUBSET);
        var updates = new Array(ants.length);
        var i = 0;
        for(i = 0; i < ants.length; i++){
            console.log('======================== ANT ' + i + ' ========================');    
            console.log('Checking if node is a ' + ants[i].goalType);
            // test solution
            if(ants[i].goalType === ants[i].position.classification){
                ants[i].goalType = (ants[i].goalType === 'food') ? 'nest' : 'food';
                console.log('Ant found goal. New goal: ' + ants[i].goalType);
                ants[i].lastVisited = null;
            }
            let antPosition = ants[i].position;
            console.log('Ants is on position');
            console.table(ants[i].position);
            let outgoingLinks = this.environment.findOutgoingLinks(antPosition);
            console.table(outgoingLinks);
            if(outgoingLinks.length === 0){
                ants[i].position = this.position;
                ants[i].goalType = 'food';
                ants[i].lastVisited = null;
                continue;
            }
            let adjacentLinks = outgoingLinks.filter((link) => {
                if(!ants[i].lastVisited)
                    return true;
                return (link !== ants[i].lastVisited) && (link !== this.environment.findComplementaryLink(ants[i].lastVisited))
            });
            // if no adjacent link is found, include the visited one
            if(adjacentLinks.length === 0)
                adjacentLinks = outgoingLinks;
            console.log('Adjacent links are:');
            console.table(adjacentLinks);
            let link = this.policy.chooseNextLink(ants[i], adjacentLinks);
            console.log('Ants chosed to go on link');
            console.table(link);
            this.environment.updateDirectionalParticles(this.PHEROMONE_MAX_TRESHOLD);
            let update = this.policy.releasePheromone(link, this.PHEROMONE);
            console.log('Ant updated with pheromone:');
            console.table(update);
            updates[i] = update;

            ants[i].position = link.target;
            ants[i].lastVisited = link;

            if(ants[i].position)
                ants[i].position.noOfAnts += 1;
            if(ants[i].lastVisited.start > 0)
                ants[i].lastVisited.source.noOfAnts -=1;
                

            console.log('Ants changed position: it is on ');
            console.table(ants[i].position);
            console.log('========================================================================')
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

    notify(data){
        // add specific variables because they are not present at the moment of creation (add them to prototype instead?)
        this.environment.addPropertyOnNodes('noOfAnts', 0);
        this.environment.addPropertyOnLinks('pheromone', 1);
    }

    setPolicy(policy){
        this.policy = policy;
    }


}