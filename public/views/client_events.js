var e = null;
var controller = null;

function loadEditor(){
  e = document.getElementById("graph");
  controller = new EnvironmentController(e);
  setupEvents();
}

function setupEvents(){
  document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
  document.addEventListener('keydown', (event) => insertEdgeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteEdgeOnKeyPress());
}

function insertNodeOnKeyPress(){
  let key = event.key;
  if(key === '+'){
    controller.insertNode('p');
  }
}


function insertEdgeOnKeyPress(){
  let key = event.key;
  if(key === '-'){
    controller.insertEdgeFromUserSelection();
  } 
}


function deleteNodeOnKeyPress(){
  let key = event.key;
  if(key === 'Delete'){
    controller.deleteNodeFromUserSelection();
  }
  
}


function deleteEdgeOnKeyPress(){
  let key = event.key;
  if(key === 'Delete'){
    controller.deleteEdgeFromUserSelection();
  }
}