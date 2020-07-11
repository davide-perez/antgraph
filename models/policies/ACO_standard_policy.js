class ACOStandardPolicy {

    constructor(){
        this.name = 'ACO';
    }

// Required methods

    // information needed to select the next nodes:
    // the adjacent links and a (minimal) memory. The visitedPath can consist of a single
    // edge too, if we want to keep the ant memory at the minimum.
    // This version uses the classical version of the pheromone function (without considering length or other params).
    // Then creates a cumulative distribution function in an array to make a weighted choice.
    // Note: chosen the interval 0..100 because by standard js generates a rand between 0 and 1.
    chooseNextLink(ant, adjacentLinks){

        var alpha = 1;
        // sum of all pheromones (denominator)
        var total = adjacentLinks.reduce((sum, link) => sum + Math.pow(link.pheromone,alpha),0);
        // probability mass function
        var probabilities = adjacentLinks.map(link => {
            return {link: link, prob: link.pheromone / total};
        });
        // discrete cumulative density function
        var discreteCdf = probabilities.map((p,i,arr) => 
            arr.filter((elem, j) => j <= i)
               .reduce((total, probs) => total + probs.prob,0)
        );
        
        /*console.log('Probabilities:');
        console.table(probabilities);
        console.log('Cumulative:');
        console.table(discreteCdf);*/

        var rand = Math.random();
        //console.log('Searching rand index: ' + rand);
        var index = binarySearchLeft(rand, discreteCdf);
        //console.log('Index found: ' + index);
        //console.log('Link found: ['+ probabilities[index].link.source.id + ' to ' + probabilities[index].link.target.id + ']');

        var chosen = probabilities[index].link;

        //ant.position = chosen.target;
        //ant.visited[0] = chosen;

        return chosen;


        // Binary search implementation which returns the index where "value" should be inserted to keep the list ordered.
        function binarySearchLeft(value, list) {
            let low = 0;
            let high = list.length - 1;
            let mid;
            while(low < high){
                mid = Math.floor((low + high)/2);
                if(list[mid] < value)
                    low = mid + 1;
                else
                    high = mid;
            }
            return low;
        }
    }

    releasePheromone(link, totalPheromone){
        // path here is an object of form {link}. All pheromone goes on the single edge. In canonical formula, length matters: 1/link.length
        return {link: link, pheromone: totalPheromone};

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