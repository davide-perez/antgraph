class AntColony {

    constructor(env) {
        this.environment = env.environment();
        this.position = env.findNodesByClassification('start')[0];
        this.ants = new Array(this.NO_OF_ANTS);
        this.policy = null;
        this.evaporation = 0.0;
        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 100;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 1000;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;
    }


    initAnts(){
        var startPos = this.position;
        for(let i = 0; i < this.ants.size; i++){
            let ant = {position: startPos, visited: []};
            this.ants[i] = ant;
        }
    }

    iterate() {
        let i = 0, that = this;
        doACO(i);

        function doACO(i) {
            setTimeout(function () {
                this.ACO();
                if (i < that.NO_OF_ITERATIONS) {
                    doACO(i);
                }
            }, TIMEOUT);
        }
    }

    // "polymorphic" algorithm
    ACO(){
        let ants = this.policy.selectAnts(this.ants, this.SIZE_OF_SUBSET);
        let updates = new Array(ants.length);
        for(i = 0; i < ants.length; i++){
            let antPosition = ant.position;
            let adjacentLinks = this.environment.findOutgoingLinks(antPosition);
            let edge = this.policy.chooseNextLink(ant, adjacentLinks);
            let update = this.policy.releasePheromone(edge, totalPheromone);
            updates[i] = update; // will be links
        }
        this.policy.updatePheromones(updates);
        this.daemonActions();
        }

    setPolicy(policy){
        this.policy = policy;
    }


}