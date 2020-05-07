class StandardColony {

    constructor(env) {
        this.environment = env.environment();
        this.ants = [];
        this.pheromone = 0.0;
        this.evaporation = 0.0;

        this.releaseAnt();
        this.releaseAnt();
        this.releaseAnt();
    }


    releaseAnt() {
        let antWorker = new Worker('./models/agents/standard_ant_worker.js');
        antWorker.onmessage = (e) => {
            console.log('Message received from an ant');
            console.table(e.data);
        }
        this.ants.push(antWorker);
        antWorker.postMessage(this.environment);
        //if environment changes, update all ants.
    }

}