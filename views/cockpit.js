
function disableAlgorithmButtons(){
    $('input[name=algorithm-radios]').attr("disabled",true);
    $('#start-btn').attr("disabled",true);
    $('#reporting-btn').attr("disabled",true);
}

function enableAlgorithmButtons(){
    $('input[name=algorithm-radios]').attr("disabled",false);
    $('#start-btn').attr("disabled",false);
    $('#reporting-btn').attr("disabled",false);
}

function getSelectedAlgorithm(){
    return $('input[name=algorithm-radios]:checked').val();
}

function resetEnvironment(){
    if(!confirm('Reset environment? All nodes and links will be deleted.'))
        return;
    controller.reinit();
}

function switchInteractiveMode(){
    if(INTERACTIVE_MODE){
        INTERACTIVE_MODE = false;
        controller.disableGraphicsInteraction();
    }
    else{
        INTERACTIVE_MODE = true;
        controller.enableGraphicsInteraction();
    }
}

function setAlgorithm(name){
    name = 'rb' + name;
    $(name).attr('checked', true);
}

function fetchAlgorithmParams(colony){
    $('#noOfAntsParam').val(colony.NO_OF_ANTS);
    $('#noOfIterationsParam').val(colony.NO_OF_ITERATIONS);
    $('#pheromoneParam').val(colony.PHEROMONE);
    $('#alphaParam').val(colony.ALPHA);
    $('#betaParam').val(colony.BETA);
    $('#rhoParam').val(colony.RHO);
}

function setAlgorithmParams(colony){
    var noOfAnts = parseInt($('#noOfAntsParam').val());
    var noOfIterationsParam = parseInt($('#noOfIterationsParam').val());
    var pheromoneParam = parseFloat($('#pheromoneParam').val());
    var alphaParam = parseFloat($('#alphaParam').val());
    var betaParam = parseFloat($('#betaParam').val());
    var rhoParam = parseFloat($('#rhoParam').val());

    // validate params
    noOfAnts = noOfAnts < 1 ? 1 : noOfAnts;
    noOfIterationsParam = (isNaN(noOfIterationsParam) || noOfIterationsParam < 1) ? Infinity : noOfIterationsParam;
    pheromoneParam = pheromoneParam < 0 ? 0 : pheromoneParam;
    alphaParam = alphaParam < 0 ? 0 : alphaParam;
    betaParam = betaParam < 0 ? 0 : betaParam;
    rhoParam = rhoParam < 0 ? 0 : rhoParam;

    colony.NO_OF_ANTS = noOfAnts;
    colony.NO_OF_ITERATIONS = noOfIterationsParam;
    colony.PHEROMONE = pheromoneParam;
    colony.ALPHA = alphaParam;
    colony.BETA = betaParam;
    colony.RHO = rhoParam;
}

function fetchReportingParams(reportingEngine){
    $('#noOfReportingIterations').val(reportingEngine.noOfIterations);

    switch(reportingEngine.reportingMode){
        case 'agent':
            setReportingMode('Agent');
            break;
        case 'algorithm':
            setReportingMode('Algorithm');
            break;
    }
}

function setReportingParams(reportingEngine){
    var noOfReportingIterations = parseInt($('#noOfReportingIterations').val());
    noOfReportingIterations = (isNaN(noOfReportingIterations) || noOfReportingIterations < 1) ? 100 : noOfReportingIterations;

    var selectedMode = getSelectedReportingMode();

    reportingEngine.noOfIterations = noOfReportingIterations;
    reportingEngine.reportingMode = selectedMode;
}

function setReportingMode(name){
    mode = '#rb' + name;
    $(mode).attr('checked', true);
}

function getSelectedReportingMode(){
    return $('input[name=reporting-radios]:checked').val();
}

function updateEnvironmentInfo(){
    $('#noOfNodesInfo').text(controller.graph.nodes.length);
    $('#noOfLinksInfo').text(controller.graph.links.length / 2);
}


function updateAlgorithmResult(){
    var solution = colony.currentSolution;
    if(!solution)
        return;
    var pathString = '';
    solution.forEach((link,index) => {
        if(index === 0){
            pathString += '[ node ' + link.source.id + ' - node ' + link.target.id;
            return;
        }
        pathString += ' - node ' + link.source.id + ' - node ' + link.target.id;
    });
    pathString += ' ]';
    var resultText = `Last run of ${colony.name} completed evaluating a path of length ${solution.length}. <br>Path found: ${pathString}`;
    $('#algorithm-result').html(resultText);
}

function updateReportingResult(){
    var resultText = `Report completed. <b>${reportingEngine.colony.name}</b> has been run ${reportingEngine.noOfIterations} times.<br><br>\
                    <b>ALGORITHM CONFIGURATION</b><br><b>No. of ants:</b> ${reportingEngine.colony.NO_OF_ANTS}<br>\
                    <b>No. of iterations: </b> ${reportingEngine.colony.NO_OF_ITERATIONS}<br>\
                    <b>Pheromone unit: </b> ${reportingEngine.colony.PHEROMONE}<br>\
                    <b>alpha: </b> ${reportingEngine.colony.ALPHA}<br>\
                    <b>beta: </b> ${reportingEngine.colony.BETA}<br>\
                    <b>rho: </b> ${reportingEngine.colony.RHO}<br>`
    var successRate = reportingEngine.noOfBestSolutions / reportingEngine.solutions.length * 100;
    if(reportingEngine.reportingMode === 'agent'){
        resultText += `<br>A total number of ${reportingEngine.solutions.length} solutions were found by ants.\
                       Optimal solution was found by ${reportingEngine.noOfBestSolutions} ants, with an accuracy rate of ${successRate.toFixed(2)}%.`;
    }
    else{
        resultText += `<br>A total number of ${reportingEngine.solutions.length} solutions were found by ${reportingEngine.colony.name} algorithm.\
                        Optimal solution was found ${reportingEngine.noOfBestSolutions} times, with a success rate of ${successRate.toFixed(2)}%.`;
    }
    $('#reporting-result').html(resultText);
}