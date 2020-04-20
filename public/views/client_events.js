var e = null;
var controller = null;

function loadEditor(){
  e = document.getElementById("graph");
  controller = new EnvironmentController(e);
  setupClientEvents();
  setupDefaultGraph();
}

function setupDefaultGraph(){
  controller.insertNode('node1', '170496');
  controller.insertNode('node2', '109855');
}

function setupClientEvents(){
  //document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
  document.addEventListener('keydown', (event) => insertLinkOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteLinkOnKeyPress());
  document.addEventListener('click', (event) => insertNodeOnClick());
}

function insertNodeOnKeyPress(){
  let key = event.key;
  if(key === '+'){
    controller.insertNode('');
  }
}

function insertNodeOnClick(){
  let x = event.clientX;
  let y = event.clientY;
  controller.insertNodeAt('',null,x,y);
}


function insertLinkOnKeyPress(){
  let key = event.key;
  if(key === '-'){
    controller.insertLinkFromUserSelection();
  } 
}


function deleteNodeOnKeyPress(){
  let key = event.key;
  if(key === 'Delete'){
    controller.deleteNodeFromUserSelection();
  }
  
}


function deleteLinkOnKeyPress(){
  let key = event.key;
  if(key === 'Backspace'){
    controller.deleteLinkFromUserSelection();
  }
}