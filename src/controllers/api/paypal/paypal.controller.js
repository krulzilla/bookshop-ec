const {apiResponse: response} = require("../../../utils/customResponse");
const {createOrder, capturePayment} = require("./paypal.support");
const {Types} = require("mongoose");
const cartModel = require("../../../models/cart.model");

class Paypal {
    async createOrder(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;

            // Get total price what client need to pay
            const cart = await cartModel.aggregate([
                {
                    $match : {
                        idUser: new Types.ObjectId(idUser)
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        localField: "idProduct",
                        foreignField: "_id",
                        as: "product"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        amount: 1,
                        "product.price": 1,
                    }
                }
            ]);

            const total = cart.reduce((res, cur) => {
                return res += cur.amount * cur.product[0].price;
            }, 0) / process.env.RATE_USD_TO_VND;

            // Create order by request to paypal server => then return order id back to client
            const order = await createOrder(total);
            return res.json(order);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async captureOrder(req, res) {
        const { orderID } = req.body;
        try {
            // Get information of order which user paid
            const captureData = await capturePayment(orderID);
            return res.json(captureData);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Paypal();