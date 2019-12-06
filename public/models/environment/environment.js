
//Class representing the environment model.
class Environment{

    constructor(nodes, edges){
        this.nodes = nodes || [];
        this.edges = edges || [];
        this.goals = [];
        this.start = [];
        //variables and params affecting the whole graph and all of the nodes

        this.observers = [];

        // Start Test
        //this.setupSampleData();
        // End Test
    }

   //////////////////////////////////START MODIFY DATASET/////////////////////////////

    /**
     * Generates a unique id code (wrt the application's domain) based on a timestamp and a random number.
     * @returns a string representing an id
     */
    generateId(){
        if (!Date.now) {
            Date.now = function() { return new Date().getTime(); }
        }
        var id = "" + Math.round(Math.random() * Date.now());
        return id;

    }

    rename(node, id){
        if(!id)
            id = this.generateId();
        if(this.findNodeById(id))
            return false;
        node.id = id;
        return true;
    }


   addNode(node){
       if(this.findNodeById(node.id))
            return false;
       this.nodes.push(node);
       this.notifyAll();
       return true;
    }

    removeNode(node){
        let node_exists = this.nodes.length !== 0 && this.findNodeById(node.id);
        if(!node_exists){
            return false;
        }
        console.log("Node first: ");
        console.table(this.nodes);
        let x_nodes = this.nodes.slice();
        let x_edges = this.edges.slice();
        this.nodes = x_nodes.filter(n => n !== node);
        //15112019
        let edges_to_del = this.edges.filter(e => e.source == node || e.target == node);
        edges_to_del.forEach(e => this.removeEdge(e));
        //15112019
        /* this._edges = x_edges.filter(e => e.source !== node && e.target !== node);
        //if(this._edges.length !== x_edges.length){
        //    console.log("An edge has been removed.");
        //}
        */
        console.log("Node removed! Id: " + node.id + ", label:" + node.label);
        this.notifyAll();
        console.log("Nodes now:");
        console.table(this.nodes);
        return true;
    }

    addEdge(source , target){
        let nodes_exists = this.findNodeById(source.id) && this.findNodeById(target.id);
        if(!nodes_exists)
            return false;
        this.edges.push(new GEdge(source,target));
        return true;
    }

    removeEdge(edge){
        let x_edges = this.edges.slice();
        this.edges = x_edges.filter(e => e !== edge);
        console.log("Edge removed!");
        console.log("Edges first: ");
        console.table(x_edges);
        console.log("Edges now: ");
        console.table(this.edges);
        return x_edges != this.edges;
    }

    clear(){
        this.nodes = [];
        this.edges = [];
    }

    setupSampleData(){
        let n1 = new GNode('Node 1');
        let n2 = new GNode('Node 2');
        //n1.rename(this,'1');
        //n2.rename(this,'2');
        this.rename(n1, '1');
        this.rename(n2, '2');
        this.addNode(n1);
        this.addNode(n2);
        this.addEdge(n1, n2);
    }
//////////////////////////////////END MODIFY DATASET//////////////////////////////



/////////////////////////////////START QUERY DATASET//////////////////////////////

findNodeById(id){
    return this.nodes.find(n => id === n.id);
}

findNodeByLabel(label){
    return this.nodes.filter(n => label === n.label);
}

contains(node){
    return this.findNodeById(node.id);
}

//////////////////////////////////END QUERY DATASET///////////////////////////////

//////////////////////////////////////////////////////OBSERVABLE METHODS/////////////////////////////////////////////////////////

    subscribe(observer){
        this.observers.push(observer);
        if(this.debug)
            console.log('An observer has subscribed to this subject. No. of observers: ' + this.observers.lenght);
    }

    unsubscribe(observer){
        this.observers = this.observers.filter(o => o !== observer);
        if(this.debug)
            console.log('An observer has unsubscribed to this subject. No. of observers: ' + this.observers.lenght);
    }

    notify(observer){
        var self = this;
        if(this.observers.find(o => o === observer)){
            observer.update(self);
            if(this.debug)
                console.log('A single observer has been notified of the subject change.\nSubject:');
                console.table(self);
                console.log('Observer:\n');
                console.table(observer);
        }
        
    }

    notifyAll(){
        var self = this;
        self.observers.forEach(o => o.update(self));
        if(this.debug){
            console.log('All ' + self.observers.lenght + ' observers have been notified of the subject change.\nSubject:');
            console.table(self);
        }
    }

}