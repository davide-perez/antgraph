class StandardAnt {

  contructor(position, name) {
    this.name = name || '';
    this.currentPosition = null;
    this.lastVisited = null;
    //this.routingVector = position.outgoingEdges();

    this.setupMessage();
  }

  move() { }

  setData() { }

  isOnGoalNode() {
    return this.currentPosition.classification === 'goal';
  }

  setupMessage() {
    onmessage = (e) => {
      console.log('Message received from main script:');
      console.table(e.data);
    };
  }
}
