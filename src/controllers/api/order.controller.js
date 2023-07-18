const {apiResponse: response} = require("../../utils/customResponse");
const cartModel = require("../../models/cart.model");
const productModel = require("../../models/product.model");
const typeTransportModel = require("../../models/typeTransport.model");
const orderModel = require("../../models/order.model");
const orderDetailModel = require("../../models/orderDetail.model");
const {Types} = require("mongoose");

class Order {
    async getAll(req, res) {
        try {
            const orders = await orderModel.find();

            return response(res, true, "Get all orders", 200, orders);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const author = await orderModel.findOne({_id: id});

            return response(res, true, "Get order successfully", 200, author);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getByUser(req, res) {
        try {
            const idUser = req.params.idUser;

            const orders = await orderModel.find({
                idUser
            }).populate("typePayment", "shortName").sort({createdAt: -1});

            return response(res, true, "Get all orders", 200, orders);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getDetailsById(req, res) {
        try {
            const id = req.params.id;

            const order = await orderModel.aggregate([
                {
                    $match: {
                        _id: new Types.ObjectId(id)
                    }
                },
                {
                    $lookup : {
                        from: "type payments",
                        localField: "typePayment",
                        foreignField: "_id",
                        as: "typePayment"
                    }
                },
                {
                    $lookup : {
                        from: "type transports",
                        localField: "typeTransport",
                        foreignField: "_id",
                        as: "typeTransport"
                    }
                },
                {
                    $unwind: "$typeTransport"
                },
                {
                    $unwind: "$typePayment"
                },
                {
                    $lookup: {
                        from: "order details",
                        let: { orderId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$idOrder", "$$orderId"]
                                    }
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
                                $unwind: "$product"
                            },
                        ],
                        as: "orderDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        total: 1,
                        status: 1,
                        shippingFee: 1,
                        createdAt: 1,
                        typeTransport: {
                            name: 1,
                            description: 1
                        },
                        typePayment: {
                            name: 1,
                            shortName: 1,
                        },
                        orderDetails: {
                            amount: 1,
                            price: 1,
                            "product.name": 1,
                            "product.image": 1
                        }
                    }
                }
            ]);

            return response(res, true, "Get order success", 200, order);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            // Get parameters
            const {typeTransport: idTypeTransport, typePayment: idTypePayment, idPaypalInvoice} = req.body;

            const idUser = req.body.idUser || req.user._id;

            // Find cart of user & get price type transport
            const [cart, typeTransport] = await Promise.all([
                cartModel.aggregate([
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
                            amount: 1,
                            "product._id": 1,
                            "product.price": 1,
                        }
                    }
                ]),
                (typeTransportModel.findById(idTypeTransport))
            ]);

            const typeTransportPrice = typeTransport.price;
            const totalPrice = typeTransportPrice + cart.reduce((res, current) => {
                return res += (current.amount * current.product[0].price);
            }, 0);

            // Create order & order detail => then remove cart & decrease amount product
            const newOrder = await orderModel.create({
                idUser,
                total: totalPrice,
                typeTransport: idTypeTransport,
                shippingFee: typeTransportPrice,
                typePayment: idTypePayment,
                idPaypalInvoice
            })

            cart.forEach(async (item) => {
                // Decrease amount of product
                await productModel.findByIdAndUpdate(item.product[0]._id, {
                    $inc: {amount: -item.amount}
                })

                // Create order detail
                orderDetailModel.create({
                    idOrder: newOrder._id,
                    idProduct: item.product[0]._id,
                    amount: item.amount,
                    price: item.product[0].price
                })
            })

            // Remove cart
            await cartModel.deleteMany({idUser: idUser});

            return response(res, true, "Create order successfully", 201, newOrder);
        } catch (e) {
            if (e.name === "ValidationError") {
                let errMsg;
                Object.keys(e.errors).forEach((key) => {
                    errMsg = e.errors[key].message;
                });
                return response(res, false, errMsg, 400);
            }
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async update(req, res) {

    }

    async delete(req, res) {

    }
}

module.exports = new Order();