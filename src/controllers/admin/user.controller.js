const {uiRender: render} = require("../../utils/customResponse");

class User {
    async renderCustomerPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-customer", {name: "Customer", user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new User();