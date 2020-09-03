class AntColonySACO extends AntColony {

    constructor(env) {
        super(env);

        this.name = 'S-ACO';
        this.ONLINE_STEP_UPDATE = true;
        this.ONLINE_DELAYED_UPDATE = true;
    }

    daemonActions(){
    }

    pheromoneEvaporation(){
        this.environment.doEvaporation(this.RHO);
    }

    testSolution(ant){
        // some other context-dependent logic
        return ant.position.classification === 'goal';
    }


    // This version uses the classical version of the pheromone function (without considering length or other params).
    // Then creates a cumulative distribution function in an array to make a weighted choice.
    // Note: chosen the interval 0..100 because by standard js generates a rand between 0 and 1.
    // Problem: pheromone can never be null. Otherwise you will have a div by zero. Makes sense, because each adjacent path
    // has a chance to be taken. Which value to give as a starter?
    applyProbabilisticRule(ant, routingTable){

        // sum of all pheromones (denominator)
        var total = routingTable.reduce((sum, link) => sum + Math.pow(link.pheromone,this.ALPHA),0);
        // compute_transition_probabilities (probability mass function)
        var probabilities = routingTable.map(link => {
            return {link: link, prob: link.pheromone / total};
        });
        // discrete cumulative density function
        var discreteCdf = probabilities.map((p,i,arr) => 
            arr.filter((elem, j) => j <= i)
               .reduce((total, probs) => total + probs.prob,0)
        );

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


    compareSolutions(solution1, solution2){
        var l1 = solution1 && solution1.length > 0 ? solution1.length : Infinity;
        var l2 = solution2 && solution2.length > 0 ? solution2.length : Infinity;
        if(l1 < l2)
            return solution1;
        return solution2;
    }



}