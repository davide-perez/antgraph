var CANVAS_WIDTH = 700;
var CANVAS_HEIGHT = 700;
var COLOR_SCALE = ["#b3b3ff", "#8080ff", "#4d4dff", "#1a1aff", "#0000ff", "#0000e6", "#0000cc", "#0000b3", "#000099", "#000080","#000066"];
var INTERACTIVE_MODE = true;
var TIMEOUT = 300;

var PHEROMONE_DEFAULT = 0.1;
var PHEROMONE_MAX_TRESHOLD = 100;
var MAX_LINK_WIDTH = 20;

var PHEROMONE_UNIT = 0.1;
var NO_OF_ANTS = 100;
var NO_OF_ANTS_AS_UPPERBOUND = false;
var RANDOM_PURGE = true;
var PURGE_PROBABILITY = 0;
var NO_OF_ITERATIONS = Infinity;
var SIZE_OF_SUBSET = 10;
var ALPHA = 1;
var BETA = 1;
var RHO = 0.01;


var e = null;
var controller = null;
var colony = null;

function loadEditor() {
  e = document.getElementById("graph");
  controller = new GraphController(e);
  controller.drawEnvironment();  
  setupClientEvents();
  setupDefaultGraph();
  updateEnvironmentInfo();
  fetchAlgorithmParams();
  controller.centerViewPort();
}

function setupDefaultGraphFromFile() {
  // does not work without a local server due to CORS policy
  $.getJSON('resources/graph_default.json', function(data){
    loadGraphFromParsedJSON(data);
  });
}

function setupDefaultGraph(){
  loadGraphFromParsedJSON(AS_ACO_DEFAULT_GRAPH_JSON);
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
      if(!controller.findNodesByClassification('start') || !controller.findNodesByClassification('goal')){
        alert('Environment must have a start node and a goal node for S-ACO to be run on it.');
        return;
      }
      colony = new AntColonySACO(controller);
      break;
    case 'AS-ACO':
      if(!controller.findNodesByClassification('start') || !controller.findNodesByClassification('goal')){
        alert('Environment must have a start node and a goal node for AS-ACO to be run on it.');
        return;
      }
      colony = new AntColonyASACO(controller);
      break;
    default:
      alert('No valid algorithm selected.');
      return;
  } 
}


async function run() {
  if(!colony){
    alert('No algorithm selected. Please select an algorithm from the corresponding tab.');
    return;
  }
  if(!confirm('Run "' + colony.name + '" with the selected settings?'))
    return;
  setAlgorithmParams();
  colony.reset();
  disableAlgorithmButtons();
  disableEnvButtons();
  await colony.ACOMetaHeuristic();
  enableAlgorithmButtons();
  enableEnvButtons();
}


function stop(){
  if(!colony){
    alert('No algorithm selected. Please select an algorithm from the corresponding tab.');
    return;
  }
  if(!confirm('Reset the simulation?'))
    return;
  colony.active = false;
  colony.reset();
}

function insertNodeOnKeyPress() {
  let key = event.key;
  if (key === '+') {
    controller.insertNode('');
    updateEnvironmentInfo();
  }
}

function insertNodeOnClick() {
  if(!INTERACTIVE_MODE)
    return;
  let x = event.clientX;
  let y = event.clientY;
  if(event.target.tagName === 'CANVAS'){
    controller.insertNodeAt('', null, 'normal', x, y);
    updateEnvironmentInfo();
  }
}


function insertLinkOnKeyPress() {
  if(!INTERACTIVE_MODE)
    return;
  let key = event.key;
  if (key === '-') {
    controller.insertLinkFromUserSelection();
    updateEnvironmentInfo();   
  }
}


function deleteNodeOnKeyPress() {
  if(!INTERACTIVE_MODE)
    return;
  let key = event.key;
  if (key === 'Delete') {
    controller.deleteNodeFromUserSelection();
    updateEnvironmentInfo();
  }

}


function deleteLinkOnKeyPress() {
  if(!INTERACTIVE_MODE)
    return;
  let key = event.key;
  if (key === 'Backspace') {
    controller.deleteLinkFromUserSelection();
    updateEnvironmentInfo();
  }
}


function setNodeClassificationOnKeyPress() {
  if(!INTERACTIVE_MODE)
    return;
  switch (event.key) {
    case 'g':
      controller.setNodeClassificationFromUserSelection('goal', true);
      break;
    case 's':
      controller.setNodeClassificationFromUserSelection('start', true);
      break;
    case 'n':
      controller.setNodeClassificationFromUserSelection('normal', false);
      break;
  }
}


function showWaitDialog(message) {    
  message = message || 'Please wait...';
  if (document.querySelector("#waitDialog") == null) {
      var modalLoading = `<div class="modal" id="waitDialog" data-backdrop="static" data-keyboard="false" role="dialog">\
          <div class="modal-dialog">\
              <div class="modal-content">\
                  <div class="modal-header">\
                      <h4 class="modal-title">${message}</h4>\
                  </div>\
                  <div class="modal-body">\
                      <div class="progress">\
                        <div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar"\
                        aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%; height: 40px">\
                        </div>\
                      </div>\
                  </div>\
              </div>\
          </div>\
      </div>`;
      $(document.body).append(modalLoading);
  }

  $("#waitDialog").modal("show");
}


function hideWaitDialog() {
  $("#waitDialog").modal("hide");
}