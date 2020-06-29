class ACOAnglePolicy {

    constructor(){
        this.name = 'ACO with angles';

        this.PHEROMONE = 1;
        this.NO_OF_ANTS = 10;
        this.STEPS_PER_TICK = 1;
        this.TICK_INTERVAL = 300;
        this.NO_OF_ITERATIONS = 20;
        this.TIMEOUT = 300;
        this.SIZE_OF_SUBSET = 10;
    }

    // information needed to select the next nodes:
    // the adjacent links and a (minimal) memory. The visitedPath can consist of a single
    // edge too, if we want to keep the ant memory at the minimum.
    chooseNextLink(ant, adjacentLinks){
        const random = adjacentLinks[Math.floor(Math.random() * adjacentLinks.length)];
        return random;
    }

    releasePheromone(link, totalPheromone){
        // path here is an object of form {link}. All pheromone goes on the single edge.
        return {link: link, pheromone: totalPheromone};

    }

    updatePheromones(updates){
        updates.forEach(update => {
            // update of form {edge, pheromoneQty}
            let link = update.link;
            link.pheromone += update.pheromone;
        });
    }

    // partial Fisher-Yates shuffle
    selectAnts(ants, sizeOfSubset){
        var selected = [];
        var l = ants.length;
        var taken = [];
        var n = sizeOfSubset < l && sizeOfSubset > 0 ? sizeOfSubset : l;
        while(n--){
            var k = Math.floor(Math.random()*l);
            selected[n] = ants[k in taken ? taken[k] : k];
            taken[k] = --l in taken ? taken[l] : l;
        }
        return selected;
    }





}