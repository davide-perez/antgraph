class ACOAnglePolicy {

    constructor(){
        this.name = 'ACO with angles';
    }

// Required methods

    // information needed to select the next nodes:
    // the adjacent links and a (minimal) memory. The visitedPath can consist of a single
    // edge too, if we want to keep the ant memory at the minimum.
    chooseNextLink(ant, adjacentLinks){
        /*
        const random = adjacentLinks[Math.floor(Math.random() * adjacentLinks.length)];
        ant.position = random.target;
        ant.visited.push(random);
        return random;
        */
       var angles = new Array(adjacentLinks.length);
       var pheromones = new Array(adjacentLinks.length);
       var lastLink = ant.visited.slice(-1)[0]; // what happens if ant is on start position? this will be undefined. 0 by default?
       // But then a straight line should be better, as ants prefer to go straight?
       angles = adjacentLinks.map(link => this.angleBetweenLinks(lastLink,link));
       pheromones = adjacentLinks.map(link => link.pheromone);
       // sum of elements in this array must be 100, since it is a density function.
       // elements of type {link, prob}, sum of probs must be 100.
       var probabilityMap = [];

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

    probabilityDistribution(linksToChoose,relativeAngle,pheromones){
        var totalProbability = 1.0;
        var values = new Array(linksToChoose.length);
        for(let i = 0; i < linksToChoose.length; i++){
            values[i] = 1;
        }
    }

// distinguish cases in which there is no angle vs when there is a zero angle
// TODO: fix wrong calculations!
    angleBetweenAdjacentLinks(l1,l2){
        // Special case #0: invalid arguments
        if(!(l1 && l2))
            return null;
        // Special case #1: non-adjacent links
        if((l1.source !== l2.target) && (l2.source !== l1.target))
            return null;
        
        var p = new Point(l1.source.x,l1.source.y);
        var q = new Point(l1.target.x,l1.target.y);
        var r = new Point(l2.source.x,l2.source.y);
        var s = new Point(l2.target.x,l2.target.y);
        var t = new Line(p,q); // line on which l1 lies
        var u = new Line(r,s); // line on which l2 lies
        var m1 = t.slope();
        var m2 = u.slope();
        var angleRad = m1 * m2 !== 1 ? Math.atan((m2 - m1) / (1 - m1 * m2)) : NaN;
        var angleDeg = angleRad * 180 / Math.PI

        return angleDeg;


        function Point(x,y){
            this.x = x;
            this.y = y;
        }
        function Line(p1, p2){
            this.p1 = p1;
            this.p2 = p2;                

            this.slope = function(){
            // Special case #0: invalid points
            if(!this.p1 || !this.p2)
                return null;
            // Special case #1: overlapping points
            if(this.p1.x === this.p2.x && this.p1.y === this.p2.y)
                return null;
            // Special case #2: vertical line
            // NaN is returned because this case is invalid matematically (not a real function)
            // but not practically, since a vertical line forms an angle with any other intersecting line.
            if(this.p1.x - this.p2.x === 0)
                return NaN;
            return (this.p2.y - this.p1.y) / (this.p2.x - this.p1.x);
            }

            this.intercept = function(){
                let m = this.slope();
                if(!m || isNaN(m))
                    return null;
                return this.p1.y - m * this.p1.x;
            }
        }
            
    }
}