const http = require('http');
const fs = require('fs');

const hostname = '127.0.0.1';
const port = 4010;


const server = http.createServer((req, res) => {
  serveHTML("/public/editor.html", res);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//move to server
function serveHTML(pathToFile, response){
  fs.readFile("." + pathToFile, function(err, data){
  if (err) {
    response.writeHead(404);
    response.write("File not found!");
    response.end();
  }
  else{
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(data);
    response.end();
  }
});
}