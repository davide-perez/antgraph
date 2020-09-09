class AntColonyASACO extends AntColony {

    constructor(env) {
        super(env);

        this.name = 'AS-ACO';
    }

    daemonActions(){
    }

    pheromoneEvaporation(){
        this.environment.doEvaporation(RHO);
    }

    // This version uses the classical version of the pheromone function (without considering length or other params).
    // Then creates a cumulative distribution function in an array to make a weighted choice.
    // Note: chosen the interval 0..100 because by standard js generates a rand between 0 and 1.
    // Problem: pheromone can never be null. Otherwise you will have a div by zero. Makes sense, because each adjacent path
    // has a chance to be taken. Which value to give as a starter?
    applyProbabilisticRule(ant, routingTable){

        if(routingTable.length === 1){
            ant.lastDirection = routingTable[0];
            return routingTable[0];
        }

        var lastDirection = ant.lastVisited;

        // sum of all pheromones (denominator)
        var total = routingTable.reduce((sum, link) => sum + Math.pow(link.pheromone / PHEROMONE_MAX_TRESHOLD, ALPHA)*(Math.pow(this.angleHeuristic(lastDirection, link),BETA)),0);
        // compute_transition_probabilities (probability mass function)
        var probabilities = routingTable.map(link => {
            let weightedProb = Math.pow(link.pheromone / PHEROMONE_MAX_TRESHOLD,ALPHA)*(Math.pow(this.angleHeuristic(lastDirection, link),BETA))
            return {link: link, prob: weightedProb / total};
        });
        console.log('Probabilities:');
        console.table(probabilities);

        // discrete cumulative density function
        var discreteCdf = probabilities.map((p,i,arr) => 
            arr.filter((elem, j) => j <= i)
               .reduce((total, probs) => total + probs.prob,0)
        );
        //console.log('Function:');
        //console.table(discreteCdf)
        // apply_ant_decision_policy
        var rand = Math.random();
        //console.log('Searching rand index: ' + rand);
        var index = binarySearchLeft(rand, discreteCdf);
        //console.log('Index found: ' + index);

        var chosen = probabilities[index].link;

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


    angleHeuristic(link1, link2){
        if(!link1 || !link2)
            return 0;
        if(link1.target !== link2.source)
            return 0;
        var a = link1.source;
        var b = link1.target;
        var c = link2.target;

        var x0 = a.x;
        var y0 = a.y;
        var x1 = b.x;
        var y1 = b.y;
        var x2 = c.x;
        var y2 = c.y;

        var xb = x1-x0;
        var yb = y1-y0;
        var xc = x2-x1;
        var yc = y2-y1;

        var numTheta = xb * xc + yb * yc;
        var denomTheta = Math.sqrt( Math.pow(xb,2) + Math.pow(yb, 2)) * Math.sqrt( Math.pow(xc,2) + Math.pow(yc,2));
        

        var theta = Math.acos(numTheta / denomTheta);

        return 1 - (theta / Math.PI);
    }   

}