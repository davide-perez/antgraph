function testGraph(){
        // Random tree
        const N = 7;
        const gData = {
            nodes: [...Array(N).keys()].map(i => ({ id: i })),
            links: [...Array(N).keys()]
            .filter(id => id)
            .map(id => ({
                source: id,
                target: Math.round(Math.random() * (id-1))
            }))
        };
        const Graph = ForceGraph3D()
            (document.getElementById('graph'))
            .numDimensions(2)
            .graphData(gData);

}


function d2Graph(){
    console.log("Creating nodes...")
    const N = 300;
    const gData = {
      nodes: [...Array(N).keys()].map(i => ({ id: i })),
      links: [...Array(N).keys()]
        .filter(id => id)
        .map(id => ({
          source: id,
          target: Math.round(Math.random() * (id-1))
        }))
    };
    const Graph = ForceGraph()
      (document.getElementById('graph'))
        .linkDirectionalParticles(3)
        .graphData(gData);
}



