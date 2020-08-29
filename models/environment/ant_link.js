class AntLink extends GLink {
    constructor(source, target){
        super(source, target);        
        this.pheromone = 0.1;
    }
}