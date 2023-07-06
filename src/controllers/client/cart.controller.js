const {uiRender: render} = require("../../utils/customResponse");
const typeTransportModel = require("../../models/typeTransport.model");
const typePaymentModel = require("../../models/typePayment.model");
const userModel = require("../../models/user.model");

class Cart {
    async cart(req, res, next) {
        try {
            return render(res, "client-cart", {name: "Cart", user: req.user});
        } catch (e) {
            next({status: 500});
        }
    }

    async checkout(req, res, next) {
        try {
            const typeTransports = await typeTransportModel.find();
            const typePayments = await typePaymentModel.find();
            const userInfo = await userModel.findById(req.user._id).select("fullname phone address");

            return render(res, "client-checkout", {name: "Checkout", user: req.user, typeTransports, typePayments, userInfo});
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Cart();