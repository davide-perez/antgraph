
//Class representing the environment model.
class Environment{

    constructor(nodes, edges){
        this._nodes = nodes || [];
        this._edges = edges || [];
        this._goals = [];
        this._start = [];
        //variables and params affecting the whole graph and all of the nodes

        this._observers = [];
    }

   //////////////////////////////////START MODIFY DATASET/////////////////////////////

   addNode(node){
       if(!node){
           return false;
       }
       this._nodes.push(node);
       this.notifyAll();
       return true;
    }

    removeNode(node){
        let node_exists = this._nodes.length !== 0 && this.findNodeById(node.id);
        if(!node_exists){
            return false;
        }
        let x_nodes = this._nodes;
        let x_edges = this._edges;
        this._nodes = x_nodes.filter(n => n !== node);
        this._edges = x_edges.filter(e => e.source !== node && e.target !== node);
        if(this._edges.length !== x_edges.length)
            console.log("An edge has been removed.");
        console.log("Node removed! " + node._id + " " + node.label);
    }

    addEdge(source , target){
        let nodes_exists = this.findNodeById(source.id) && this.findNodeById(target.id);
        if(!nodes_exists)
            return false;
        this._edges.push(new GEdge(source,target));
    }

    removeEdge(edge){
        let x_edges = this._edges;
        this._edges = x_edges.filter(e => e !== edge);
    }

    clear(){
        this._nodes = [];
        this._edges = [];
    }

    rename(node, newId){
        if(!this.findNodeById(node._id))
            return false;
        node._id = newId;
        return false;
    }

//////////////////////////////////END MODIFY DATASET//////////////////////////////



/////////////////////////////////START QUERY DATASET//////////////////////////////

findNodeById(id){
    return this._nodes.find(n => id === n.id);
}

findNodeByLabel(label){
    return this._nodes.find(n => label === n.label);
}

contains(node){
    return this.findNodeById(node.id);
}

//////////////////////////////////END QUERY DATASET///////////////////////////////

//////////////////////////////////////////////////////OBSERVABLE METHODS/////////////////////////////////////////////////////////

    subscribe(observer){
        this._observers.push(observer);
        if(this.debug)
            console.log('An observer has subscribed to this subject. No. of observers: ' + this._observers.lenght);
    }

    unsubscribe(observer){
        this._observers = this._observers.filter(o => o !== observer);
        if(this.debug)
            console.log('An observer has unsubscribed to this subject. No. of observers: ' + this._observers.lenght);
    }

    notify(observer){
        var self = this;
        if(this._observers.find(o => o === observer)){
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
        self._observers.forEach(o => o.update(self));
        if(this.debug){
            console.log('All ' + self._observers.lenght + ' observers have been notified of the subject change.\nSubject:');
            console.table(self);
        }
    }

}