// current problem: 
// each edge is composed by two edges, to get bidirectionality.
// Ants tend to move forward towards the goal. They lay pheromone on the edge they pass through, but only on forward node!
// Ants skip last visited node, unless it is the only choice they have.
// Once they reach the goal, they should change their goal type attribute and go backwards.
// Problem 1) Currently pheromone is kept on forward edge only. Backward edge has no pheromone on it!
// Solution 1) Instead of laying pheromone only on forward edge, lay it on both edges (when updating). But show quantity of forward links only.
// Problem 2) 0 pheromone on links gives a lot of problem on mathematical formula for calculating. Keep it 1 as minimum value.
// Problem 3) There's no a thing such a "backward link"! It depends from where the ant comes.
class AntColony {

    constructor(env) {
        this.environment = env;
        this.environment.registerObserverOnGraph(this);

        this.position = this.environment.findNodesByClassification('nest')[0];
        this.policy = null;
        this.evaporation = 0.0;

        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 10;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 50;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 3;
        this.PHEROMONE_MAX_TRESHOLD = 100;

    }


    initAnts(){
        // visited is an array to improve extensibility! More arcs can be added, not just the last one, depending on algorithm.
        this.ants = new Array(this.NO_OF_ANTS);
        var startPos = this.position;
        for(let i = 0; i < this.NO_OF_ANTS; i++){
            let ant = {position: startPos, goalType: 'food', lastVisited: null};
            this.ants[i] = ant;
        }
        console.log('Ants created.');
    }

    run() {
        this.initAnts();

        var i = 0;
        var that = this;
        console.log('ACO starting with %s policy', this.policy.name)
        doACO(i);

        // needed to loop the function n times with a fixed interval
        function doACO(i) {
            setTimeout(function () {
                that.ACO();
                if (i < that.NO_OF_ITERATIONS) {
                    i++;
                    console.log('======================== ITERATION ' + i + ' ========================');
                    doACO(i);
                    console.log('========================================================================')
                }
            }, that.TIMEOUT);
        }

        console.log('ACO completed: ' + this.NO_OF_ITERATIONS + ' iterations.');
    }

    // "polymorphic" algorithm. This algorithm lets the implementation to the active policy,
    // letting full personalization to every step.
    // JS lacks interfaces, so duck typing will suffice: it is sufficient that the strategy class
    // implements the required methods (with the right signature, otherwise undefined errors will rise)

    // problem: when coming back, pheromone should be added to the main link only.
    ACO(){
        var ants = this.policy.selectAnts(this.ants, this.SIZE_OF_SUBSET);
        var updates = new Array(ants.length);
        var i = 0;
        for(i = 0; i < ants.length; i++){
            console.log('======================== ANT ' + i + ' ========================');    
            console.log('Checking if node is a ' + ants[i].goalType);
            // test solution
            if(ants[i].goalType === ants[i].position.classification){
                ants[i].goalType = (ants[i].goalType === 'food') ? 'nest' : 'food';
                console.log('Ant found goal. New goal: ' + ants[i].goalType);
                ants[i].lastVisited = null;
            }
            let antPosition = ants[i].position;
            console.log('Ants is on position');
            console.table(ants[i].position);
            let outgoingLinks = this.environment.findOutgoingLinks(antPosition);
            //skip ant if it is on an insulated node
            if(!outgoingLinks)
                continue;
            let adjacentLinks = outgoingLinks.filter((link) => {
                if(!ants[i].lastVisited)
                    return true;
                return (link !== ants[i].lastVisited) && (link !== this.environment.findComplementaryLink(ants[i].lastVisited))
            });
            // if no adjacent link is found, include the visited one
            if(adjacentLinks.length === 0)
                adjacentLinks = outgoingLinks;
            console.log('Adjacent links are:');
            console.table(adjacentLinks);
            let link = this.policy.chooseNextLink(ants[i], adjacentLinks);
            console.log('Ants chosed to go on link');
            console.table(link);
            this.environment.updateDirectionalParticles(); // Where do I put this
            let update = this.policy.releasePheromone(link, this.PHEROMONE);
            console.log('Ant updated with pheromone:');
            console.table(update);
            updates[i] = update;

            ants[i].position = link.target;
            ants[i].lastVisited = link;

            console.log('Ants changed position: it is on ');
            console.table(ants[i].position);
            console.log('========================================================================')
        }
        this.daemonActions();
        this.updatePheromones(updates);
    }

    daemonActions(){
        // evaporation. Look for formula
    }

    updatePheromones(updates){
        updates.forEach(update => {
            // update of form {link, pheromoneQty}
            let link = update.link;
            let complementaryLink = controller.findComplementaryLink(link);
            link.pheromone += update.pheromone;
            complementaryLink.pheromone += update.pheromone;
        });
    }

    notify(data){
        // environment changed
    }

    setPolicy(policy){
        this.policy = policy;
    }


}