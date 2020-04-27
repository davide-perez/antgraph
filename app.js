var express = require("express");
var app = express();
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  user: "dperezcuevas",
  password: "p4$$w0rd",
  database: "db_antgraph",
});
/*
connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT server_name, port, homepage_path FROM server_setup", function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
});
*/
var port = 3000;

app.use(express.static(__dirname + "/public/"));

app.get("/", function (req, res) {
  console.log(__dirname);
  res.sendFile(__dirname + "/public/views/editor.html");
  console.log("File " + __dirname + "" + "/public/views/editor.html sent!");
});

app.listen(port, function () {
  console.log("Example app listening on port " + port);
});
