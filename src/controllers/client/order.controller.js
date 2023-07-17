const {uiRender: render} = require("../../utils/customResponse");
const orderModel = require("../../models/order.model");

class Order {
    async completeOrder(req, res, next) {
        try {
            return render(res, "client-complete_order", {name: "Completing order"}, false);
        } catch (e) {
            next({status: 500});
        }
    }

    async renderMyOrderPage(req, res, next) {
        try {
            const idUser = req.user._id;

            const myOrders = await orderModel.find({
                idUser
            }).populate("typePayment", "shortName").sort({createdAt: -1});

            return render(res, "client-orders", {name: "My orders", user: req.user, orders: myOrders});
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Order();