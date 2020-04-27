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

function displayNodeInfo(node, index) {
  resetItemInfo();
  resetItemInfo(1);
  if (!node)
    return;
  let selector = "#item-info";
  if (index === 1)
    selector = selector + "-2";

  $(selector).append(
    "<tr><td><b>Name</b></td><td>" + node.label + "</td></tr>"
  );
  $(selector).append(
    "<tr><td><b>Id</b></td><td>" + node.id + "</td></tr>"
  );
  $(selector).append(
    "<tr><td><b>Type</b></td><td>" + node.classification + "</td></tr>"
  );
  $(selector).append(
    "<tr><td><b>Fbf</b></td><td>" + node.outgoingLinks.length + "</td></tr>"
  );
}

function displayEdgeInfo(edge) {
  resetItemInfo();
  if (!edge) return;
  $("#item-info").append(
    "<tr><td><b>Source node</b></td><td>" + edge.source.id + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Target node</b></td><td>" + edge.target.id + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Cost</b></td><td>" + edge.cost + "</td></tr>"
  );
  $("#item-info").append(
    "<tr><td><b>Pheromone</b></td><td>" + edge.pheromone + "</td></tr>"
  );
}

function resetItemInfo(index) {
  let selector = "#item-info";
  if (index === 1)
    selector = selector + "-2";
  $(selector).html("");
}
