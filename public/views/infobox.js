function updateGraphInfo(env) {
  if (!env)
    return;
  $("#graph-info").empty();
  let noOfNodes = env.nodes.length || 0;
  let noOfEdges = env.links.length || 0;
  $("#graph-info").after("<tr><td><b>" + noOfNodes + "</b></td><td>type here</td></tr>");
  $("#graph-info").after("<tr><td><b>" + noOfEdges + "</b></td><td>type here</td></tr>");
}

function showNodeInfo(node) {
  if (!node)
    return;
  let infobox = $("#infobox");
}