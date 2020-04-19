var e = null;
var controller = null;

function loadEditor(){
  e = document.getElementById("graph");
  controller = new EnvironmentController(e);
  setupEvents();
}

function setupEvents(){
  document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
  document.addEventListener('keydown', (event) => insertLinkOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteLinkOnKeyPress());
}

function insertNodeOnKeyPress(){
  let key = event.key;
  if(key === '+'){
    controller.insertNode('p');
  }
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