
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
    $('noOfAntsParam').val(colony.NO_OF_ANTS);
    $('noOfIterationsParam').val(colony.NO_OF_ITERATIONS);
    $('pheromoneUnitParam').val(colony.PHEROMONE);
    $('alphaParam').val(colony.ALPHA);
    $('betaParam').val(colony.BETA);
    $('rhoParam').val(colony.NO_OF_ANTS);
}