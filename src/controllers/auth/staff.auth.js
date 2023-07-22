const BaseAuth = require("./base.auth");

class StaffAuth extends BaseAuth {
    constructor() {
        const role = "Staff";
        super(role);
    }

    isStaff = async (req, res, next) => {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === this.role) return next();
        }

        return res.redirect("/staffcp/login");
    }

    isNotStaff = async (req, res, next) => {
        if (req.isUnauthenticated && req.user === null) return next();

        return res.redirect("/staffcp");
    }
}

module.exports = new StaffAuth();