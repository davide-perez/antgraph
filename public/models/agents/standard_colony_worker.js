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

    startAll() {
        var startNode = this.environment.nodes.filter(n => n.classification === 'start')[0];
        this.ants.forEach(a => {
            a.postMessage({ cmd: 'start', args: [startNode] })
        });
    }


    releaseAnt() {
        let antWorker = new Worker('./models/agents/standard_ant_worker.js');
        this.setupMessages(antWorker);
        this.ants.push(antWorker);
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
                case 'step':
                    let edge = args[0];
                    this.ants.forEach(a => {
                        a.postMessage({ cmd: 'update_edge', args: [edge] })
                    });
                    break;

            }
        }
    }

}