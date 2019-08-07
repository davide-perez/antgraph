class GEdge {

    constructor(source, target){

        if(!target)
            target = source;

        this.source = source;
        this.target = target;
        console.log("Edge instantiated. Values: " + JSON.stringify(this));


    }


}