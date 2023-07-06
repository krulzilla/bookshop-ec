const {apiResponse: response} = require("../utils/customResponse");
const {Types} = require("mongoose");
const cartModel = require("../models/cart.model");


class Test {
    async index(req, res) {
        const idUser = new Types.ObjectId("64a0613c5153b08e07059ede");

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
        }, 0);

        return response(res, true, "Test api", 200, [cart, total]);
    }
}

module.exports = new Test();