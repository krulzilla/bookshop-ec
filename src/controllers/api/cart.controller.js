const cartModel = require("../../models/cart.model");
const userModel = require("../../models/user.model");
const productModel = require("../../models/product.model");
const {apiResponse: response} = require("../../utils/customResponse");

class Cart {
    async getAll(req, res) {
        try {
            const carts = await cartModel.find({})
                .populate("idProduct", "name price idAuthor")


            return response(res, true,  "Get carts successfully", 200, carts);
        } catch (e) {
            console.log(e);
            return response(res, false,  "Somethings went wrong!", 500);
        }
    }

    async getByUser(req, res) {

    }

    async createOrModify(req, res) {
        try {
            let {idUser, idProduct, amount = 1} = req.body;

            // Check user & product is valid ?
            if (!await userModel.findById(idUser)) return response(res, false,  "User id is invalid!", 400);

            const product = await productModel.findById(idProduct).select("amount");
            if (!product) return response(res, false,  "Product id is invalid!", 400);


            const cart = await cartModel.findOne({
                idUser,
                idProduct
            }).select("amount");

            if (cart) {
                // Check amount in cart > amount product
                if (cart.amount + (+amount) > product.amount)
                    return response(res, false,  `Not enough stock to add (${product.amount} remaining)!`, 200);
                // Check if amount in cart = 0 then remove
                if (cart.amount + (+amount) == 0) {
                    await cartModel.findByIdAndDelete(cart._id);
                    return response(res, true, `Removed product when amount = 0`, 200);
                }
            }

            // Action modify cart
            const newCart = await cartModel.findOneAndUpdate({
                idUser,
                idProduct
            }, {$inc: {amount}}, {upsert: true, new: true});

            return response(res, true, "You added product to cart!", 201, newCart);
        } catch (e) {
            console.log(e);
            return response(res, false,  "Somethings went wrong!", 500);
        }
    }

    async delete(req, res) {
        try {
            const {id: idCart} = req.params;

            const deleteCart = await cartModel.findByIdAndDelete(idCart);

            return response(res, true, "Delete cart successfully!");
        } catch (e) {
            return response(res, false,  "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Cart();