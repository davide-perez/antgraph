// let those win over the local Colony Object variables?
var PHEROMONE = 1;
var NO_OF_ANTS = 1;
var STEPS_PER_TICK = 1;
var TICK_INTERVAL = 300;
var NO_OF_ITERATIONS = 20;
var TIMEOUT = 300;
var SIZE_OF_SUBSET = 10;
var PHEROMONE_MAX_TRESHOLD = 100;

var e = null;
var controller = null;
var colony = null;

function loadEditor() {
  e = document.getElementById("graph");
  controller = new GraphController(e);
  setupClientEvents();
  setupDefaultGraph();
}

function setupDefaultGraph2() {
  controller.insertNode('starter', '170496', 'nest');
  var start = controller.getNode('170496');
  var node1 = controller.insertAnonymousNode();
  var node2 = controller.insertAnonymousNode();
  var node3 = controller.insertAnonymousNode();
  var node4 = controller.insertAnonymousNode();
  controller.insertLink(start,node1);
  controller.insertLink(start,node2);
  controller.insertLink(start,node3);
  controller.insertLink(start,node4);
}

function setupDefaultGraph() {
  controller.insertNode('starter', '170496', 'nest');
  controller.insertNode('ender', '000000', 'food');
  var start = controller.getNode('170496');
  var end = controller.getNode('000000');
  var node1 = controller.insertAnonymousNode();
  var node2 = controller.insertAnonymousNode();
  var node3 = controller.insertAnonymousNode();
  controller.insertLink(start,node1);
  controller.insertLink(node1,node2);
  controller.insertLink(node2,end);
  controller.insertLink(start,node3);
  controller.insertLink(node3,end);
}


function setupClientEvents() {
  //document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
  document.addEventListener('keydown', (event) => insertLinkOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteLinkOnKeyPress());
  document.addEventListener('keydown', (event) => emitParticleOnKeyPress());
  document.addEventListener('click', (event) => insertNodeOnClick());
  document.addEventListener('keydown', (event) => setNodeClassificationOnKeyPress());

  document.addEventListener('keypress', (event) => testAntColony());
}


function testAntColony() {
  if (event.key !== 't')
    return;
  if (confirm('Release ants and start algorithm?')){
    var policyMgr = new ACOPolicyManager();
    var policy = new ACOStandardPolicy();
    policyMgr.checkPolicy(policy);
    colony = new AntColony(controller);
    colony.setPolicy(policy);
    colony.run();
    
  }
}

function insertNodeOnKeyPress() {
  let key = event.key;
  if (key === '+') {
    controller.insertNode('');
  }
}

function insertNodeOnClick() {
  let x = event.clientX;
  let y = event.clientY;
  controller.insertNodeAt('', null, 'normal', x, y);
}


function insertLinkOnKeyPress() {
  let key = event.key;
  if (key === '-') {
    controller.insertLinkFromUserSelection();
  }
}


function deleteNodeOnKeyPress() {
  let key = event.key;
  if (key === 'Delete') {
    controller.deleteNodeFromUserSelection();
  }

}


function deleteLinkOnKeyPress() {
  let key = event.key;
  if (key === 'Backspace') {
    controller.deleteLinkFromUserSelection();
  }
}

function emitParticleOnKeyPress() {
  let key = event.key;
  if (key === 'Control') {
    controller.emitParticleAcrossSelectedLink();
  }
}

function setNodeClassificationOnKeyPress(){
  switch(event.key){
    case 'f':
      controller.setNodeClassificationFromUserSelection('food'); 
      break;
    case 'n':
      controller.setNodeClassificationFromUserSelection('nest'); 
      break;
  }
}