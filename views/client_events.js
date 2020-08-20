var e = null;
var controller = null;
var colony = null;

function loadEditor() {
  e = document.getElementById("graph");
  controller = new GraphController(e);
  controller.drawEnvironment();
  setupClientEvents();
  setupDefaultGraph();
}

function setupDefaultGraph2() {
  controller.insertNode('starter', '170496', 'start');
  var start = controller.getNode('170496');
  var node1 = controller.insertAnonymousNode('A');
  var node2 = controller.insertAnonymousNode('B');
  var node3 = controller.insertAnonymousNode('C');
  var node4 = controller.insertAnonymousNode('D');
  controller.insertLink(start,node1);
  controller.insertLink(start,node2);
  controller.insertLink(start,node3);
  controller.insertLink(start,node4);
}

function setupDefaultGraph() {
  controller.insertNode('starter', '170496', 'start');
  controller.insertNode('ender', '000000', 'goal');
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
    if(!colony)
      colony = new AntColony(controller)
    else{
      colony.reset();
      controller.resetEditor();
    }
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
      controller.setNodeClassificationFromUserSelection('goal'); 
      break;
    case 'n':
      controller.setNodeClassificationFromUserSelection('start'); 
      break;
  }
}