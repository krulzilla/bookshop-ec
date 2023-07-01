const BaseAuth = require("./base.auth");

class ClientAuth extends BaseAuth {
    constructor() {
        const role = "Client";
        super(role);
        // this.register = this.register.bind(this);
    }

    // async login(req, res) {
    //
    // }
    //
    // async register(req, res) {
    //     await super.register(req, res);
    // }

    // async isAuthenticated(req, res) {
    //
    // }
    //
    // async isUnauthenticated(req, res) {
    //
    // }
}

module.exports = new ClientAuth();