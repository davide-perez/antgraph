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
        this.setupMessages(antWorker);
        this.ants.push(antWorker);
        antWorker.postMessage({ cmd: 'start', args: [] });
    }


    terminateAnt(ant) {
        ant.terminate();
    }


    setupMessages(ant) {
        ant.onmessage = (e) => {
            var cmd = e.data.cmd || 'unknown';
            var args = e.data.args || [];
            console.log('Command ' + cmd + ' received from ant with ' + args.length + ' args');
            console.table(args);
            switch (cmd) {
                case 'outgoing_links':
                    // return adjacent edges!
                    let node = args[0];
                    // may need promises here...
                    let outgoingLinks = this.environment.findOutgoingLinks(node);
                    ant.postMessage({ cmd: 'outgoing_links', args: [outgoingLinks] })
                    break;

            }
        }
    }

}