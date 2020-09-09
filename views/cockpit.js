function disableEnvButtons() {
    $('#reset-btn').attr("disabled", true);
    $('#interactive-btn').attr("disabled", true);
    $('#export-btn').attr("disabled", true);
    $('#import-btn').attr("disabled", true);
}

function enableEnvButtons() {
    $('#reset-btn').attr("disabled", false);
    $('#interactive-btn').attr("disabled", false);
    $('#export-btn').attr("disabled", false);
    $('#import-btn').attr("disabled", false);
}


function disableAlgorithmButtons() {
    $('input[name=algorithm-radios]').attr("disabled", true);
    $('#start-btn').attr("disabled", true);
}

function enableAlgorithmButtons() {
    $('input[name=algorithm-radios]').attr("disabled", false);
    $('#start-btn').attr("disabled", false);
}

function getSelectedAlgorithm() {
    return $('input[name=algorithm-radios]:checked').val();
}

function resetEnvironment() {
    if (!confirm('Reset environment? All nodes and links will be deleted.'))
        return;
    controller.reinit();
    updateEnvironmentInfo();
}

function switchInteractiveMode() {
    if (INTERACTIVE_MODE) {
        INTERACTIVE_MODE = false;
        controller.disableGraphicsInteraction();
    }
    else {
        INTERACTIVE_MODE = true;
        controller.enableGraphicsInteraction();
    }
}

function setAlgorithm(name) {
    name = 'rb' + name;
    $(name).attr('checked', true);
}

function fetchAlgorithmParams() {
    $('#noOfSelectedAntsParam').val(SIZE_OF_SUBSET);
    $('#noOfAntsParam').val(NO_OF_ANTS);
    $('#noOfIterationsParam').val(NO_OF_ITERATIONS);
    $('#pheromoneParam').val(PHEROMONE_UNIT);
    $('#pheromoneMinTreshold').val(PHEROMONE_DEFAULT);
    $('#pheromoneMaxTreshold').val(PHEROMONE_MAX_TRESHOLD);
    $('#purgeProbability').val(PURGE_PROBABILITY);
    $('#alphaParam').val(ALPHA);
    $('#betaParam').val(BETA);
    $('#rhoParam').val(RHO);

    if(NO_OF_ANTS_AS_UPPERBOUND)
        $('#rbUseAsUpperbound').attr('checked',true)
    else
        $('#rbUseAsFixedNo').attr('checked',true);
}

function setAlgorithmParams() {
    var noOfSelectedAnts = parseInt($('#noOfSelectedAntsParam').val());
    var noOfAnts = parseInt($('#noOfAntsParam').val());
    var noOfIterationsParam = parseInt($('#noOfIterationsParam').val());
    //var useNoOfSelectedAntsAsUpperBound = $('#noOfAntsAsUpperboundParam').prop('checked');
    var pheromoneParam = parseFloat($('#pheromoneParam').val());
    var alphaParam = parseFloat($('#alphaParam').val());
    var betaParam = parseFloat($('#betaParam').val());
    var rhoParam = parseFloat($('#rhoParam').val());
    var pheromoneMinTreshold = parseFloat($('#pheromoneMinTreshold').val());
    var pheromoneMaxTreshold = parseFloat($('#pheromoneMaxTreshold').val());
    var purgeProbability = parseFloat($('#purgeProbability').val());
    var useNoOfSelectedAntsAsUpperBound = $('input[name=algorithm-radios2]:checked').val() === 'rbUseAsUpperbound';


    // validate params
    noOfAnts = noOfAnts < 1 ? 1 : noOfAnts;
    noOfSelectedAnts = noOfAnts > noOfAnts ? noOfAnts : noOfSelectedAnts;
    noOfIterationsParam = (isNaN(noOfIterationsParam) || noOfIterationsParam < 1) ? Infinity : noOfIterationsParam;
    pheromoneParam = pheromoneParam < 0 ? 0 : pheromoneParam;
    alphaParam = alphaParam < 0 ? 0 : alphaParam;
    betaParam = betaParam < 0 ? 0 : betaParam;
    rhoParam = rhoParam < 0 ? 0 : rhoParam;
    pheromoneMinTreshold = pheromoneMinTreshold < 0.1 ? 0.1 : pheromoneMinTreshold;
    pheromoneMaxTreshold = pheromoneMaxTreshold < 1 ? 100 : pheromoneMaxTreshold;
    purgeProbability = purgeProbability < 0 ? 0 : purgeProbability;

    SIZE_OF_SUBSET = noOfSelectedAnts;
    NO_OF_ANTS = noOfAnts;
    NO_OF_ITERATIONS = noOfIterationsParam;
    NO_OF_ANTS_AS_UPPERBOUND = useNoOfSelectedAntsAsUpperBound;
    PHEROMONE_UNIT = pheromoneParam;
    ALPHA = alphaParam;
    BETA = betaParam;
    RHO = rhoParam;
    PURGE_PROBABILITY = purgeProbability;
    PHEROMONE_DEFAULT = pheromoneMinTreshold;
    PHEROMONE_MAX_TRESHOLD = pheromoneMaxTreshold;
}

function updateEnvironmentInfo() {
    $('#noOfNodesInfo').text(controller.graph.nodes.length);
    $('#noOfLinksInfo').text(controller.graph.links.length / 2);
}

function exportGraphToJSON() {
    if (!controller.graph)
        return;
    if (!confirm('Download the current graph configuration?'))
        return;

    var graph = controller.getGraphComponents();
    var nodesToExport = graph.nodes.map(node => convertNodeToExport(node));
    var linksToExport = graph.links.map(link => convertLinkToExport(link));

    var name = 'graph_' + new Date().toLocaleString();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ nodes: nodesToExport, links: linksToExport }));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", name + ".json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();


    function convertNodeToExport(node) {
        var expNode = {};
        expNode.label = node.label;
        expNode.id = node.id;
        expNode.classification = node.classification;
        expNode.x = node.x;
        expNode.y = node.y;
        return expNode;
    }

    function convertLinkToExport(link) {
        var expLink = {};
        var sourceId = link.source.id;
        var targetId = link.target.id;
        expLink.source = sourceId;
        expLink.target = targetId;
        expLink.isMainLink = link.isMainLink;
        expLink.cost = link.cost;
        return expLink;
    }
}

function importFileFromClient() {
    $('#file-selector').click();
}


function importGraphFromJSON(event) {
    var input = event.target;
    var reader = new FileReader();
    reader.onload = function () {
        var graphJSON = reader.result;
        var parsedGraph = JSON.parse(graphJSON);
        loadGraphFromParsedJSON(parsedGraph);
    };
    reader.readAsText(input.files[0]);

};

function loadGraphFromParsedJSON(parsedGraph) {
    var newNodes = [];
    var newLinks = [];
    parsedGraph.nodes.forEach(node => newNodes.push(convertNodeToImport(node)));
    parsedGraph.links.forEach(link => newLinks.push(convertLinkToImport(link, newNodes)));

    controller.reinit();
    controller.graph.setNewComponents(newNodes, newLinks);
    updateEnvironmentInfo();


    function convertLinkToImport(link, importedNodes) {
        var source = importedNodes.find(node => node.id === link.source);
        var target = importedNodes.find(node => node.id === link.target);
        var impLink = new AntLink(source, target);
        impLink.isMainLink = link.isMainLink;
        impLink.cost = link.cost;
        return impLink;

    }

    function convertNodeToImport(node) {
        var impNode = new AntNode();
        impNode.id = node.id;
        impNode.label = node.label;
        impNode.classification = node.classification;
        impNode.x = node.x;
        impNode.y = node.y;
        return impNode;
    }
}

function insertImportedGraph(importedGraph) {

    controller.reinit();

    importedGraph.nodes.forEach(node => controller.insertNodeAt(node.label, node.id, node.classification, node.x, node.y));

    importedGraph.links.filter(l => l.isMainLink).forEach(link => {
        let source = controller.getNode(link.source.id);
        let target = controller.getNode(link.target.id);
        controller.insertLink(source, target);
    })
}