
function disableAlgorithmButtons(){
    $('input[name=algorithm-radios]').attr("disabled",true);    
}

function enableAlgorithmButtons(){
    $('input[name=algorithm-radios]').attr("disabled",false);    
}

function getSelectedAlgorithm(){
    return $('input[name=algorithm-radios]:checked').val();
}

function resetEnvironment(){
    if(!confirm('Reset environment? All nodes and links will be deleted.'))
        return;
    controller.reset();
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