class GLink {
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.pheromone = 0;
    this.cost = 1;
    this.isBackwardLink = false;
  }
}
