var e = null;
var controller = null;
let colony = null;

function loadEditor() {
  e = document.getElementById("graph");
  controller = new GraphController(e);
  setupClientEvents();
  setupDefaultGraph();
  colony = new StandardColony(controller);
}

function setupDefaultGraph() {
  controller.insertNode('node1', '170496', 'start');
  controller.insertNode('node2', '109855');
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
  if (event.key === 't')
    colony.startAll();
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