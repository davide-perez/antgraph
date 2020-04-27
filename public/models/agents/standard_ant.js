class StandardAnt {

  contructor(position, name) {
    this.name = name || '';
    this.currentPosition = null;
    this.lastVisited = null;
    this.routingVector = position.outgoingEdges();
  }

  move() { }

  isOnGoalNode() {
    return this.currentPosition.classification === 'goal';
  }
}
