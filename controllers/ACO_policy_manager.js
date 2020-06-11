class ACOPolicyManager {

    constructor(){
        this.policies = [];
    }

    addPolicy(policy){
        this.policies.push(policy);
    }

    removePolicy(name){
        let newPolicies = this.policies.filter(policy => policy.name !== name);
        this.policies = newPolicies;
    }

    findPolicy(name){
        return this.policies.find(policy => policy.name === name);
    }
}