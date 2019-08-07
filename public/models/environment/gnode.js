class GNode {

    constructor(id){
        if (!id){
            id = this.generateId();
        }
        this.id = id;
        console.log("Node instantiated. Values: " + JSON.stringify(this));
        this.isGoal = false;
        this.isStart = false;

    }

/**
 * Generates a unique id based on a timestamp and a random number.
 * @returns a string representing an id
 */

    generateId(){
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        return "" + Math.round(Math.random() * Date.now());
    }


}