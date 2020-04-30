class StandardAnt {

  contructor(position, name) {
    this.name = name || '';
    this.currentPosition = null;
    this.lastVisited = null;
    this.routingVector = position.outgoingEdges();

    //TODO
    this.env = null;
  }

  move() { }

  isOnGoalNode() {
    return this.currentPosition.classification === 'goal';
  }

  setupMessage() {
    onmessage = (e) => {
      console.log('Message received from main script:');
      console.table(e.data);
      postMessage({ pos: this.currentPosition });
    };
  }
}
