const cartModel = require("../../models/cart.model");
const userModel = require("../../models/user.model");
const productModel = require("../../models/product.model");
const {apiResponse: response} = require("../../utils/customResponse");
const {Types} = require("mongoose");

class Cart {
    async getAll(req, res) {
        try {
            const carts = await cartModel.find({})
                .populate("idProduct", "name price idAuthor")


            return response(res, true,  "Get carts successfully", 200, carts);
        } catch (e) {
            return response(res, false,  "Somethings went wrong!", 500);
        }
    }

    async getByUser(req, res) {
        try {
            const {id: idUser} = req.params;
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
                    $lookup: {
                        from: "authors",
                        localField: "product.idAuthor",
                        foreignField: "_id",
                        as: "author"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        amount: 1,
                        idProduct: 1,
                        "product._id": 1,
                        "product.name": 1,
                        "product.price": 1,
                        "product.image": 1,
                        "author.name": 1
                    }
                }
            ]);

            return response(res, true,  "Get cart by user successfully!", 200, cart);
        } catch (e) {
            return response(res, false,  "Somethings went wrong!", 500);
        }
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
            return response(res, false,  "Somethings went wrong!", 500);
        }
    }

    async update(req, res) {
        try {
            const {id: idCart} = req.params;
            const {idProduct, amount} = req.body;

            if (amount < 1) return response(res, false, "Amount must larger than 1!", 400);
            const product = await productModel.findById(idProduct).select("amount price");
            if (!product) return response(res, false, "Product id is invalid!", 400);

            if (amount > product.amount) return response(res, false, `Not enough stock to add (${product.amount} remaining)!`, 400);

            const updateCart = await cartModel.findByIdAndUpdate(idCart, {
                amount
            }, {new: true})

            return response(res, true, "Update amount successfully!", 200, product);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
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