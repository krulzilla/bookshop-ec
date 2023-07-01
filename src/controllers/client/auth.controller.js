const {uiRender: render} = require("../../utils/customResponse");

class Auth {
    async login(req, res) {
        return render(res, "client-login", [], false);
    }

    async register(req, res) {
        return render(res, "client-register", [], false);
    }
}

module.exports = new Auth();