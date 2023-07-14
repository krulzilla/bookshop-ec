const {uiRender: render} = require("../../utils/customResponse");

class Order {
    async completeOrder(req, res, next) {
        try {
            return render(res, "client-complete_order", {name: "Completing order"}, false);
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Order();