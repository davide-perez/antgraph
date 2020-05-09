if ('function' === typeof importScripts) {
    importScripts('standard_ant.js');
    onmessage = (e) => {
        var cmd = e.data.cmd || 'unknown';
        var args = e.data.args || [];
        console.log('Command ' + cmd + ' received with ' + args.length + ' args');
        console.table(args);
        switch (e.data.cmd) {
            case 'start':
                position = args[0];
                console.log('Starting ant on node ' + position + '...');
                move();
                break;
            case 'stop':
                console.log('Stopping ant...');
                active = false;
                break;
            case 'die':
                console.log('Killing ant...');
                close();
                break;
            case 'position':
                console.log('Querying ant position...')
                postMessage(position);
                break;
            case 'outgoing_links':
                console.log('Sending outgoing links');
                outgoingLinks = args[0];
                break;
            case 'update':
                break;
            default:
                console.error('Unknown command. Killing ant...');
                close();
                break;
        }
    }



}

var position = null;
var outgoingLinks = [];
var visited = [];
var active = false;
const SLEEPING_TIME = 300;

async function move() {
    active = true;
    while (active) {
        await new Promise(r => setTimeout(r, SLEEPING_TIME));
        step();
    }
}

function step() {
    postMessage({ cmd: 'outgoing_links', args: [position] });
}

// Next: this worker should control the ant by receiving messages from the main thread in a
// commadn fashion (i.e. a switch that ivokes  a function depending on the message incoming)
// Make graph observable, so that ants can check for changes?
// https://github.com/codedread/bitjs/tree/master/io to check how closure are used to encapsulate classes in workers

// Ant should receive the current position and the list of outgoing edges as messages. Then, they evaluate in this thread
// the next move and the probabilities (based on parameters in edges), update their current position and send back the
// new position along with the pheromone quantity that they deposit. The main thread will sum the quantity and update the number of ants
// for that node. If the edge is destroyed meanwhile, ant is updated with the new environemnt?. Set up message system between ants and colony.

