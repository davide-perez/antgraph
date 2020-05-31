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
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;
    }

    iterate() {
        let i = 0, that = this;
        doWork(i);

        function doWork(i) {
            setTimeout(function () {
                let ants = that.selectRandomAntSubset();
                that.moveGroup(ants);
                that.updatePheromones(); // apply all udpdates here
                i++;
                that.daemonActions(i);
                if (i < that.NO_OF_ITERATIONS) {
                    doWork(i);
                }
            }, TIMEOUT);
        }
    }

    // partial Fisher-Yates shuffle
    selectAntSubset(){
        var selected = [];
        var l = ants.length;
        var taken = [];
        var n = this.SIZE_OF_SUBSET < l && this.SIZE_OF_SUBSET > 0 ? this.SIZE_OF_SUBSET : l;
        while(n--){
            var k = Math.floor(Math.random()*l);
            selected[n] = ants[k in taken ? taken[k] : k];
            taken[k] = --l in taken ? taken[l] : l;
        }
        return selected;
    }


    moveGroup(ants){
        
    }

    applyUpdates(ants){
        
    }

    releaseAnt() {
        var ant = n // create ant locally so that you may access environment and avoid circular references.
        ant.startPosition = this;
        this.ants.push(ant);
        //do work for every ant
    }


    updatePheromones(links) {
        links.foreach();
    }





}