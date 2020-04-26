function updateGraphInfo(env) {
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

function showNodeInfo(node) {
  $("#item-info").html("");
  if (!node) return;
  $("#item-info").append(
    "<tr><td><b>Node name</b></td><td>" + noOfNodes + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Node id</b></td><td>" + noOfEdges + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Node class</b></td><td>" + noOfNodes + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Node fbf</b></td><td>" + noOfEdges + "</td></tr>"
  );
}
