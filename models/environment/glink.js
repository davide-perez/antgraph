class GLink {
  constructor(source, target) {
    this.source = source;
    this.target = target;
    this.pheromone = 1;
    this.cost = 1;
    this.isMainLink = true;
  }
}
