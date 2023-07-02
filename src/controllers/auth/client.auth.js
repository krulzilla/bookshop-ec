const BaseAuth = require("./base.auth");

class ClientAuth extends BaseAuth {
    constructor() {
        const role = "Client";
        super(role);
        // this.register = this.register.bind(this);
    }

    isClient = async (req, res, next) => {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === this.role) return next();
        }

        return res.redirect("/login");
    }

    isNotClient = async (req, res, next) => {
        if (req.isUnauthenticated && req.user === null) return next();

        return res.redirect("/");
    }
}

module.exports = new ClientAuth();