class NamingError extends Error {

    constructor(id){
        super('Node ' + id + 'already exists in this environment.');
        this.name = 'NamingError';
    }

}