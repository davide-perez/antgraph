class StandardAnt {

  contructor(colony) {
    this.colony = colony;
    this.currentPosition = position;
    this.visited = [];
    this.active = false;

    this.colony = colony;
  }

  init(stepsPerTick, tickInterval) {
    this.STEPS_PER_TICK = stepsPerTick || 1;
    this.TICK_INTERVAL = tickInterval || 300;
    this.start();
  }

  move() {
    this.step([], this.STEPS_PER_TICK);
    return [this.currentPosition];
  }

  step(path, counter) {
    if (counter = 0)
      return path;
    let adjacentNodes = colony.env.findOutgoingLinks(pos);
    let chosen = chooseNext(adjacentNodes);
    this.currentPosition = chosen.target;
    let application = { step: chosen, pheromone: 0.1 };
    this.step(path.push(application), counter - 1)
  }

  chooseNext(adjacentNodes) {
    let pheromoneMap = adjacentNodes.map(e => e.pheromone || 0);


  }

  isOnGoalNode() {
    return this.currentPosition.classification === 'goal';
  }



}
