class AntColony {

    constructor(env) {
        this.environment = env.environment();
        this.environment.registerObserver(this);

        this.position = this.environment.findNodesByClassification('start')[0];
        this.policy = null;
        this.evaporation = 0.0;

    }


    initAnts(){
        this.ants = new Array(this.policy.NO_OF_ANTS);
        var startPos = this.position;
        for(let i = 0; i < this.policy.NO_OF_ANTS; i++){
            let ant = {position: startPos, visited: []};
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

        function doACO(i) {
            setTimeout(function () {
                that.ACO();
                if (i < that.policy.NO_OF_ITERATIONS) {
                    doACO(i);
                    i++;
                }
            }, that.policy.TIMEOUT);
        }
        
        console.log('ACO completed: ' + this.policy.NO_OF_ITERATIONS + ' iterations.');
    }

    // "polymorphic" algorithm. This algorithm lets the implementation to the active policy,
    // letting full personalization to every step.
    // JS lacks interfaces, so duck typing will suffice: it is sufficient that the strategy class
    // implements the required methods (with the right signature, otherwise undefined errors will rise)
    ACO(){
        var ants = this.policy.selectAnts(this.ants, this.policy.SIZE_OF_SUBSET);
        var updates = new Array(ants.length);
        var i = 0;
        for(i = 0; i < ants.length; i++){
            let antPosition = ants[i].position;
            let adjacentLinks = this.environment.findOutgoingLinks(antPosition);
            let link = this.policy.chooseNextLink(ants[i], adjacentLinks);
            let update = this.policy.releasePheromone(link, this.policy.PHEROMONE);
            updates[i] = update;
        }
        this.policy.updatePheromones(updates);
        this.daemonActions();
    }

    daemonActions(){

    }

    notify(data){
        // environment changed
    }

    setPolicy(policy){
        this.policy = policy;
    }


}