class AntColony {

    constructor(env) {
        this.environment = env;
        this.environment.registerObserverOnGraph(this);

        this.position = this.environment.findNodesByClassification('nest')[0];
        this.policy = null;
        this.evaporation = 0.0;

        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 1;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 200;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;
        this.PHEROMONE_MAX_TRESHOLD = 100;

    }


    initAnts(){
        // visited is an array to improve extensibility! More arcs can be added, not just the last one, depending on algorithm.
        this.ants = new Array(this.NO_OF_ANTS);
        var startPos = this.position;
        for(let i = 0; i < this.NO_OF_ANTS; i++){
            let ant = {position: startPos, goalType: 'food', visited: []};
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
                    doACO(i);
                }
            }, that.TIMEOUT);
        }

        console.log('ACO completed: ' + this.NO_OF_ITERATIONS + ' iterations.');
    }

    // "polymorphic" algorithm. This algorithm lets the implementation to the active policy,
    // letting full personalization to every step.
    // JS lacks interfaces, so duck typing will suffice: it is sufficient that the strategy class
    // implements the required methods (with the right signature, otherwise undefined errors will rise)

    // problem: when coming back, pheromone should be added to the main link only.
    ACO(){
        var ants = this.policy.selectAnts(this.ants, this.SIZE_OF_SUBSET);
        var updates = new Array(ants.length);
        var i = 0;
        for(i = 0; i < ants.length; i++){
            console.log('Turn of ' + i + '-th ant');
            let antPosition = ants[i].position;
            let outgoingLinks = this.environment.findOutgoingLinks(antPosition);
            //skip ant if it is on an insulated node
            if(!outgoingLinks)
                continue;
            let adjacentLinks = outgoingLinks.filter(l => ants[i].goalType === 'food' ? !l.isBackwardLink : l.isBackwardLink).filter(l => l !== ants[i].visited);
            if(adjacentLinks.length === 0)
                adjacentLinks = outgoingLinks;
            console.log('Processing links adjacent to node ');
            console.table(ants[i].position);
            console.log('Adjacent links are:');
            console.table(adjacentLinks);
            let link = this.policy.chooseNextLink(ants[i], adjacentLinks);
            this.environment.updateDirectionalParticles(); // Where do I put this
            let update = this.policy.releasePheromone(link, this.PHEROMONE);
            updates[i] = update;

            // test solution
            if(ants[i].goalType === ants[i].position.classification)
                ants[i].goalType = (ants[i].goalType === 'food') ? 'nest' : 'food'

            ants[i].position = link.target;
            ants[i].visited[0] = link; // something here does not work properly. Ants keep staying on the same edge.
        }
        this.daemonActions();
        this.updatePheromones(updates);
    }

    daemonActions(){
        // evaporation. Look for formula
    }

    updatePheromones(updates){
        // important: to avoid strange errors, lay pheromone on forward link only even when going backwards.
        updates.forEach(update => {
            // update of form {link, pheromoneQty}
            let linkToUpdate = update.link.isBackwardLink ? this.environment.findComplementaryLink(update.link) : update.link;
            linkToUpdate.pheromone += update.pheromone;
        });
    }

    notify(data){
        // environment changed
    }

    setPolicy(policy){
        this.policy = policy;
    }


}