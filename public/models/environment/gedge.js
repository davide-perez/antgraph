class GEdge {
  constructor(source, target, cost) {
    this.source = source;
    this.target = target;
    this.cost = cost || 1;
    this.pheromone = 0;
  }
}
