class StandardAnt {

  contructor(colony) {
    this.colony = colony;
    this.currentPosition = colony.position;
    this.visited = [];
    this.active = false;
    this.STEPS_PER_TICK = colony.STEPS_PER_TICK || 1;
    this.TICK_INTERVAL = colony.TICK_INTERVAL || 300;
  }

  start() {
    this.active = true;
    this.move();
  }

  move() {
    let path = [];
    this.step(this.currentPosition, path, this.STEPS_PER_TICK);
    //this.releasePheromone(path);
    this.colony.updatePheromones(path);
  }

  // remove CurrPos, pass adjacencynodes at the firsr call?
  step(currPos, path, counter) {
    if (counter = 0 || !currPos) {
      this.currentPosition = currPos;
      return path;
    }
    let adjacentNodes = colony.env.findOutgoingLinks(pos);
    let chosen = chooseNext(adjacentNodes);
    let newPos = chosen.target;
    path.push(chosen);
    this.step(newPos, path.push(chosen), counter - 1)
  }

  chooseNext(adjacentNodes) {
    let pheromoneMap = adjacentNodes.map(e => e.pheromone || 0);


  }

  // ?? ask prof how to handle pheromone 
  releasePheromone(path) {
    if (!path.length)
      return;
    let qtyPerLink = path.length;
    let pheromoneReleases = path.map(e => { link: e; pheromone: qtyPerLink });
    // crrate application map. Colony object will apply new pheromones
  }

  isOnGoalNode() {
    return this.currentPosition.classification === 'goal';
  }



}
