var e = null;
var editor = null;

function loadEditor(){
  e = document.getElementById("graph");
  editor = new EnvironmentController(e);
  setupEvents();
}

function setupEvents(){
  document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
  document.addEventListener('keydown', (event) => insertEdgeOnKeyPress());
  document.addEventListener('keydown', (event) => deleteNodeOnKeyPress());
}

function insertNodeOnKeyPress(){
  let key = event.key;
  console.log('pressed: ' + key);
  console.log(key === '+');
  if(key === '+'){
    editor.insertNode('p');
  }
}


function insertEdgeOnKeyPress(){
  let key = event.key;
  console.log('pressed: ' + key);
  console.log(key === '-');
  if(key === '-'){
    editor.insertEdgeFromUserSelection();
  } 
}


function deleteNodeOnKeyPress(){
  let key = event.key;
  console.log('pressed: ' + key);
  if(key === 'Delete'){
    editor.deleteNodeFromUserSelection();
  }
  
}