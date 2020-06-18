class ACOPolicyManager {

    constructor(){
        this.policies = [];
    }

    addPolicy(policy){
        if (!this.checkPolicy(policy))
            throw new Error('The policy ' + policy.name + ' is not a valid policy.');
        this.policies.push(policy);
    }

    removePolicy(name){
        let newPolicies = this.policies.filter(policy => policy.name !== name);
        this.policies = newPolicies;
    }

    findPolicy(name){
        return this.policies.find(policy => policy.name === name);
    }

    checkPolicy(policy){
        let valid = (typeof policy.chooseNextLink === 'function') &&
                    (typeof policy.releasePheromone === 'function')  &&
                    (typeof policy.updatePheromones === 'function')  &&
                    (typeof policy.selectAnts === 'function');

        return valid;
    }
}