if ('function' === typeof importScripts) {
    importScripts('standard_ant.js');
    onmessage = (e) => {
        var cmd = e.data.cmd || 'unknown';
        var args = e.data.args || [];
        console.log('Command ' + cmd + ' received with ' + args.length + ' args');
        console.table(args);
        switch (e.data.cmd) {
            case 'start':
                env = args[0];
                position = args[1];
                console.log('Environment received:');
                console.table(env);
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
            case 'update_link':
                stop();
                let linkToUpdate = args[0];
                move();
                break;
            default:
                console.error('Unknown command. Killing ant...');
                close();
                break;
        }
    }



}

var env = null;
var position = null;
var visited = [];
var active = false;
const SLEEPING_TIME = 500;

async function move() {
    active = true;
    while (active) {
        await new Promise(r => setTimeout(r, SLEEPING_TIME));
        step();
        // release pheromone on edge
        // send update to colony
        // colony updates all ants?

    }
}

function step() {
    let links = outgoingLinks(position);
    let chosenLink = links[Math.floor(Math.random() * links.length)];
    position = chosenLink.target;
    postMessage();
    console.log('Did a step');
}

function stop() {
    console.log('Ant stopped.');
    active = false;
}

function onFoodNode() {
    return position.classification === 'goal';
}

function onNestNode() {
    return position.classification === 'start';
}

function outgoingLinks(node) {
    return env.links.filter(e => e.source === node) || [];
}

// Next: this worker should control the ant by receiving messages from the main thread in a
// commadn fashion (i.e. a switch that ivokes  a function depending on the message incoming)
// Make graph observable, so that ants can check for changes?
// https://github.com/codedread/bitjs/tree/master/io to check how closure are used to encapsulate classes in workers

// Ant should receive the current position and the list of outgoing edges as messages. Then, they evaluate in this thread
// the next move and the probabilities (based on parameters in edges), update their current position and send back the
// new position along with the pheromone quantity that they deposit. The main thread will sum the quantity and update the number of ants
// for that node. If the edge is destroyed meanwhile, ant is updated with the new environemnt?. Set up message system between ants and colony.

// Problem: worker - main communication is always asynchronous. Postmessage immediately returns. No way to ask something and wait for answer,
// Solution: pass environment as arg everytime worker is created. If you choose dynamic env, then update all ants everytime env changes?
// URGENT: instead of envronment.env, pass to ant colony the whole envitonment object. Then, if it will be passed, only the functionless
// version will be passed 