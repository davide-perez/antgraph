class StandardColony {

    constructor() {
        this.ants = [];
        this.pheromone = 0.0;
        this.evaporation = 0.0;
    }


    releaseAnt() {
        let antWorker = new Worker('standard_ant.js');
        antWorker.onmessage = (e) => {
            console.log('Message received from an ant');
            console.table(e.data);
        }
        this.ants.push(antWorker);
        //if environment changes, update all ants.
    }

}