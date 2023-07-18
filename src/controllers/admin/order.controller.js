const {uiRender: render} = require("../../utils/customResponse");

class Order {
    async renderOrderPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-order", {name: "Order", user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new Order();