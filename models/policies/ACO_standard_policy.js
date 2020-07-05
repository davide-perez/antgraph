class ACOStandardPolicy {

    constructor(){
        this.name = 'ACO';
    }

// Required methods

    // information needed to select the next nodes:
    // the adjacent links and a (minimal) memory. The visitedPath can consist of a single
    // edge too, if we want to keep the ant memory at the minimum.
    chooseNextLink(ant, adjacentLinks, parameters){
        var alpha = 1;
        var total = adjacentLinks.reduce((sum, link) => sum + Math.pow(link.pheromone,alpha),0);
        var probabilities = adjacentLinks.map(link => {
            return {link: link, prob: link.pheromone / total};
        });
        var cumulativeMap = probabilityMap.map(prob => {
            let probToSum = probabilityMap.filter(elem => elem.link !== prob);
            let sum = probabilityMap.reduce((total, probs) => total + probs.prob,0);
            return sum;
        })
        console.log('Probability map:');
        console.table(probabilityMap);
        console.log('Cumulative please:');
        console.table(cumulativeMap);
        


    }

    releasePheromone(link, totalPheromone){
        // path here is an object of form {link}. All pheromone goes on the single edge.
        return {link: link, pheromone: totalPheromone};

    }

    updatePheromones(updates){
        updates.forEach(update => {
            // update of form {link, pheromoneQty}
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
// Required methods
}