class AntColony {

    constructor(env) {
        this.environment = env.environment();
        this.position = this.environment.findNodesByClassification('start')[0];
        this.ants = new Array(this.NO_OF_ANTS);
        this.policy = new ACOAnglePolicy();
        this.evaporation = 0.0;

        // move these constants in the policy too?
        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 10;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 20;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;

        this.initAnts();
    }


    initAnts(){
        var startPos = this.position;
        for(let i = 0; i < this.NO_OF_ANTS; i++){
            let ant = {position: startPos, visited: []};
            this.ants[i] = ant;
        }
        console.log('Ants created.');
    }

    run() {
        var i = 0;
        var that = this;
        console.log('ACO starting with %s policy', this.policy.name)
        doACO(i);

        function doACO(i) {
            setTimeout(function () {
                that.ACO();
                if (i < that.NO_OF_ITERATIONS) {
                    doACO(i);
                    i++;
                }
            }, that.TIMEOUT);
        }
        console.log('ACO completed: ' + this.NO_OF_ITERATIONS + ' iterations.');
    }

    // "polymorphic" algorithm. This algorithm lets the implementation to the active policy,
    // letting full personalization to every step.
    // JS lacks interfaces, so duck typing will suffice: it is sufficient that the strategy class
    // implements the required methods (with the right signature, otherwise undefined errors will rise)
    ACO(){
        var ants = this.policy.selectAnts(this.ants, this.SIZE_OF_SUBSET);
        var updates = new Array(ants.length);
        var i = 0;
        for(i = 0; i < ants.length; i++){
            let antPosition = ants[i].position;
            let adjacentLinks = this.environment.findOutgoingLinks(antPosition);
            let edge = this.policy.chooseNextLink(ants[i], adjacentLinks);
            let update = this.policy.releasePheromone(edge, this.PHEROMONE);
            updates[i] = update; // will be links
        }
        this.policy.updatePheromones(updates);
        this.daemonActions();
        }

    setPolicy(policy){
        this.policy = policy;
    }


}