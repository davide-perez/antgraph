var e = null;
var controller = null;
var colony = null;

function loadEditor() {
  e = document.getElementById("graph");
  controller = new GraphController(e);
  setupClientEvents();
  setupDefaultGraph();
}

function setupDefaultGraph() {
  controller.insertNode('starter', '170496', 'start');
  var start = controller.environment().findNodeById('170496');
  var node1 = controller.environment().addAnonymousNode();
  var node2 = controller.environment().addAnonymousNode();
  var node3 = controller.environment().addAnonymousNode();
  var node4 = controller.environment().addAnonymousNode();
  controller.insertLink(start,node1);
  controller.insertLink(start,node2);
  controller.insertLink(start,node3);
  controller.insertLink(start,node4);
}


function setupClientEvents() {
  //document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
  document.addEventListener('keydown', (event) => insertLinkOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteLinkOnKeyPress());
  document.addEventListener('keydown', (event) => emitParticleOnKeyPress());
  document.addEventListener('click', (event) => insertNodeOnClick());

  document.addEventListener('keypress', (event) => testAntColony());
}


function testAntColony() {
  if (event.key !== 't')
    return;
  if (confirm('Release ants and start algorithm?')){
    var policyMgr = new ACOPolicyManager();
    var policy =new ACOAnglePolicy();
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