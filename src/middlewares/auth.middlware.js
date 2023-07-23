class AuthMiddleware {
    async isUser(req, res, next) {
        if (req.isAuthenticated && req.user) {
            return next();
        }

        res.status(403).json({msg: "Not authorized"});
    }

    async isClient(req, res, next) {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === "Client") return next();
        }

        res.status(403).json({msg: "Not authorized"});
    }

    async isStaff(req, res, next) {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === "Staff") return next();
        }

        res.status(403).json({msg: "Not authorized"});
    }

     async isAdmin(req, res, next) {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === "Admin") return next();
        }

        res.status(403).json({msg: "Not authorized"});
    }

     async isAdminOrStaff(req, res, next) {
        if (req.isAuthenticated && req.user) {
            if (req.user.role === "Admin" || req.user.role === "Staff") return next();
        }

        res.status(403).json({msg: "Not authorized"});
    }
}

module.exports = new AuthMiddleware();