if ('function' === typeof importScripts) {
    //importScripts('http://localhost:3000/models/agents/standard_ant.js');
    importScripts('standard_ant.js');
    onmessage = (e) => {
        console.log('Message received from main script:');
        console.table(e.data);
    }
    let ant = new StandardAnt();
}
// Next: this worker should control the ant by receiving messages from the main thread in a
// commadn fashion (i.e. a switch that ivokes  a function depending on the message incoming)
// Make graph observable, so that ants can check for changes?
// https://github.com/codedread/bitjs/tree/master/io to check how closure are used to encapsulate classes in workers

