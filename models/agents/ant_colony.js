class AntColony {

    constructor(env) {
        this.environment = env.environment();
        this.environment.registerObserver(this);

        this.position = this.environment.findNodesByClassification('start')[0];
        this.policy = null;
        this.evaporation = 0.0;

        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 10;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 20;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;

    }


    initAnts(){
        this.ants = new Array(this.NO_OF_ANTS);
        var startPos = this.position;
        for(let i = 0; i < this.NO_OF_ANTS; i++){
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
    ACO(){
        var ants = this.policy.selectAnts(this.ants, this.SIZE_OF_SUBSET);
        var updates = new Array(ants.length);
        var i = 0;
        for(i = 0; i < ants.length; i++){
            let antPosition = ants[i].position;
            let adjacentLinks = this.environment.findOutgoingLinks(antPosition);
            let link = this.policy.chooseNextLink(ants[i], adjacentLinks);
            let update = this.policy.releasePheromone(link, this.PHEROMONE);
            updates[i] = update;
        }
        this.daemonActions();
        this.policy.updatePheromones(updates);
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