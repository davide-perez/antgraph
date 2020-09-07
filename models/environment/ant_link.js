class AntLink extends GLink {
    constructor(source, target){
        super(source, target);        
        this.pheromone = PHEROMONE_DEFAULT;
    }
}