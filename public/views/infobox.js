function displayGraphInfo(env) {
  $("#graph-info").html("");
  if (!env) return;
  let noOfNodes = env.nodes.length || 0;
  let noOfEdges = env.links.length || 0;
  $("#graph-info").append(
    "<tr><td><b>No. of nodes</b></td><td>" + noOfNodes + "</td></tr>"
  );
  $("#graph-info").append(
    "<tr><td><b>No. of edges</b></td><td>" + noOfEdges + "</td></tr>"
  );
}

function displayNodeInfo(node) {
  resetItemInfo();
  if (!node) return;
  $("#item-info").append(
    "<tr><td><b>Node name</b></td><td>" + node.label + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Node id</b></td><td>" + node.id + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Node class</b></td><td>" + node.classification + "</td></tr>"
  );
}

function displayEdgeInfo(edge) {
  resetItemInfo();
  if (!edge) return;
  $("#item-info").append(
    "<tr><td><b>Edge source</b></td><td>" + edge.source.id + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Edge target</b></td><td>" + edge.target.id + "</td></tr>"
  );
}

function resetItemInfo() {
  $("#item-info").html("");
}
