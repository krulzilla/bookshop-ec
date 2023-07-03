const {uiRender: render} = require("../../utils/customResponse");

class Cart {
    async cart(req, res, next) {
        try {
            return render(res, "client-cart", {name: "Cart", user: req.user});
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Cart();