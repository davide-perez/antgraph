class NamingError extends Error {

    constructor(id){
        super('Node ' + id + 'already exists.');
        this.name = 'NamingError';
    }

}