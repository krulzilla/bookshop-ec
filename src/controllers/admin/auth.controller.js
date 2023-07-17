const {uiRender: render} = require("../../utils/customResponse");

class Auth {
    async renderLoginPage(req, res, next) {
        try {
            return render(res, "admin-login", {}, false);
        } catch (e) {
            return next({status: 500});
        }
    }

    logout = async (req, res, next) => {
        try {
            res.clearCookie("accessToken");
            return res.redirect("/admincp/login")
        } catch (e) {
            next({status: 500})
        }
    }
}

module.exports = new Auth();