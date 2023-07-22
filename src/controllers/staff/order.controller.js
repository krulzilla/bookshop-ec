const {uiRender: render} = require("../../utils/customResponse");

class Order {
    async renderOrderPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "staff-order", {name: "Order", user: req.user, search}, "staff_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new Order();