var test = require('tape');

test('add node test', function (t) {
    t.plan(3);
    var env = new Environment();
    var node_a = new GNode('Node A');
    var node_b = new GNode('Node B');

    t.ok(env.push(node_a), 'Node A added');
    t.ok(env.push(node_b), 'Node B added');
    t.equal((env._nodes.length,2, 'the graph contains the nodes added'));
});


