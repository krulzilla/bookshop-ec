const BaseAuth = require("./base.auth");

class AdminAuth extends BaseAuth {
    constructor() {
        const role = "Admin";
        super(role);
    }

    isAdmin = async (req, res, next) => {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === this.role) return next();
        }

        res.clearCookie("accessToken");
        return res.redirect("/admincp/login");
    }

    isNotAdmin = async (req, res, next) => {
        if (req.isUnauthenticated && req.user === null) return next();

        return res.redirect("/admincp");
    }
}

module.exports = new AdminAuth();