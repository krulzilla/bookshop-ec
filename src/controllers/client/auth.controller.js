const {uiRender: render} = require("../../utils/customResponse");

class Auth {
    async login(req, res, next) {
        try {
            return render(res, "client-login", [], false);
        } catch (e) {
            next({status: 500});
        }
    }

    async register(req, res, next) {
        try {
            return render(res, "client-register", [], false);
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Auth();