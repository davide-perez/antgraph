class StandardColony {

    constructor(env) {
        this.environment = env.environment();
        this.position = env.findNodesByClassification('start')[0];
        this.ants = [];
        this.evaporation = 0.0;
        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 100;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 1000;
        this.TIMEOUT = 50;
    }

    iterate() {
        let i = 0, that = this;
        doWork(i);

        function doWork(i) {
            setTimeout(function () {
                that.releaseAnt();
                that.updatePheromones(); // update graph references too
                i++;
                that.daemonActions(i);
                if (i < that.NO_OF_ITERATIONS) {
                    doWork(i);
                }
            }, TIMEOUT);
        }
    }

    releaseAnt() {
        var ant = {} // create ant locally so that you may access environment and avoid circular references.
        ant.startPosition = this;
        this.ants.push(ant);
        //do work for every ant
    }


    updatePheromones(links) {
        links.foreach();
    }





}