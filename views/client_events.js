var CANVAS_WIDTH = 1200;
var CANVAS_HEIGHT = 1000;

var e = null;
var controller = null;
var colony = null;

function loadEditor() {
  e = document.getElementById("graph");
  controller = new GraphController(e);
  controller.drawEnvironment();
  console.table(controller.renderer.graphObj);
  setupClientEvents();
  setupDefaultGraph();
  updateEnvironmentInfo();
}

function setupDefaultGraph() {
  controller.insertNode('starter', '170496', 'start');
  controller.insertNode('ender', '000000', 'goal');
  var start = controller.getNode('170496');
  var end = controller.getNode('000000');
  var node1 = controller.insertAnonymousNode();
  var node2 = controller.insertAnonymousNode();
  var node3 = controller.insertAnonymousNode();
  controller.insertLink(start, node1);
  controller.insertLink(node1, node2);
  controller.insertLink(node2, end);
  controller.insertLink(start, node3);
  controller.insertLink(node3, end);
}


function setupClientEvents() {
  document.addEventListener('keydown', (event) => insertLinkOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteLinkOnKeyPress());
  document.addEventListener('click', (event) => insertNodeOnClick());
  document.addEventListener('keydown', (event) => setNodeClassificationOnKeyPress());
}

function initAntColony(){
  var selectedAlgorithm = getSelectedAlgorithm();
  switch (selectedAlgorithm) {
    case 'S-ACO':
      colony = new AntColonyShortestPath(controller);
      break;
    case 'AS-ACO':
      colony = new AntColonyShortestPathAngle(controller);
      break;
    default:
      alert('No valid algorithm selected.');
      return;
  }
  fetchAlgorithmParams(colony);
}


async function run() {
  if(!confirm('Run "' + colony.name + '" with the selected settings?'))
    return;
  setAlgorithmParams(colony);
  colony.reset();
  disableAlgorithmButtons();
  var solution = await colony.ACOMetaHeuristic();
  console.log('HERES A SOLUTION:');
  console.table(solution);
  reportResults();
  enableAlgorithmButtons();
}

function insertNodeOnKeyPress() {
  let key = event.key;
  if (key === '+') {
    controller.insertNode('');
    updateEnvironmentInfo();
  }
}

function insertNodeOnClick() {
  let x = event.clientX;
  let y = event.clientY;
  if (x < CANVAS_WIDTH && y < CANVAS_HEIGHT)
    controller.insertNodeAt('', null, 'normal', x, y);
    updateEnvironmentInfo();
}


function insertLinkOnKeyPress() {
  let key = event.key;
  if (key === '-') {
    controller.insertLinkFromUserSelection();
    updateEnvironmentInfo();   
  }
}


function deleteNodeOnKeyPress() {
  let key = event.key;
  if (key === 'Delete') {
    controller.deleteNodeFromUserSelection();
    updateEnvironmentInfo();
  }

}


function deleteLinkOnKeyPress() {
  let key = event.key;
  if (key === 'Backspace') {
    controller.deleteLinkFromUserSelection();
    updateEnvironmentInfo();
  }
}


function setNodeClassificationOnKeyPress() {
  switch (event.key) {
    case 'f':
      controller.setNodeClassificationFromUserSelection('goal');
      break;
    case 'n':
      controller.setNodeClassificationFromUserSelection('start');
      break;
  }
}