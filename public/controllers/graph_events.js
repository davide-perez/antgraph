function drawHighlighted(node, ctx){
    ctx.beginPath();
    ctx.arc(node.x, node.y, 4 * 1.4, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'red';
    ctx.fill();   
}

function isHighlighted(node, nodelist){
    return nodelist.indexOf(node) !== -1;
}


function showInfo(node){
    let info = JSON.stringify(node);
    console.log(node); //will be a tooltip...
}