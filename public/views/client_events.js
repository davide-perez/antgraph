var e = null;
var editor = null;

function loadEditor(){
  e = document.getElementById("graph");
  editor = new EnvironmentController(e);
  setupEvents();
}

function setupEvents(){
  document.addEventListener('keydown', (event) => insertNodeOnKeyPress());
}

function insertNodeOnKeyPress(){
  let key = event.key;
  console.log('pressed: ' + key);
  console.log(key === '+');
  if(key === '+'){
    editor.insertNode('p');
  }
}