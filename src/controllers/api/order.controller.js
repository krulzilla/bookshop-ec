const {apiResponse: response} = require("../../utils/customResponse");
const cartModel = require("../../models/cart.model");
const productModel = require("../../models/product.model");
const typeTransportModel = require("../../models/typeTransport.model");
const orderModel = require("../../models/order.model");
const orderDetailModel = require("../../models/orderDetail.model");
const {Types, mongoose} = require("mongoose");
const customPagination = require("../../utils/customPagination");

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

            const order = await orderModel.findOne({_id: id});

            return response(res, true, "Get order successfully", 200, order);
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
                    $lookup : {
                        from: "users",
                        localField: "idUser",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$typeTransport"
                },
                {
                    $unwind: "$typePayment"
                },
                {
                    $unwind: "$user"
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
                        user: {
                            fullname: 1,
                            phone: 1,
                            address: 1
                        },
                        orderDetails: {
                            amount: 1,
                            price: 1,
                            "product._id": 1,
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

    async pagination(req, res) {
        try {
            let {search = "", page = 1, pageSize = 10} = req.query;
            // Exec query
            const pipelines = [
                {
                    $addFields: {
                        stringId: { $toString: '$_id' },
                    },
                },
                {
                    $addFields: {
                        lastCharacter:
                            { $substr: ['$stringId', { "$subtract": [ { "$strLenCP": "$stringId" }, 4]}, 4] },
                    },
                },
                {
                    $match: {
                        lastCharacter: { $regex: search, $options: "i" },
                    }
                },
                {
                    $lookup: {
                        from: "type payments",
                        foreignField: "_id",
                        localField: "typePayment",
                        as: "payment"
                    }
                },
                {
                    $lookup: {
                        from: "type transports",
                        foreignField: "_id",
                        localField: "typeTransport",
                        as: "transport"
                    }
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $project: {
                        _id: 1,
                        total: 1,
                        status: 1,
                        createdAt: 1,
                        payment: {
                            name: 1,
                            shortName: 1
                        },
                        "transport.name": 1
                    }
                }
            ]

            const orders = await customPagination(orderModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, orders);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();
        let newOrder;
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

            if (!typeTransport) return response(res, false, "Type transport is invalid", 400);

            const typeTransportPrice = typeTransport.price;
            const totalPrice = typeTransportPrice + cart.reduce((res, current) => {
                return res += (current.amount * current.product[0].price);
            }, 0);

            // Create order & order detail => then remove cart & decrease amount product
            newOrder = await orderModel.create({
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
                }, {session});

                // Create order detail
                await orderDetailModel.create({
                    idOrder: newOrder._id,
                    idProduct: item.product[0]._id,
                    amount: item.amount,
                    price: item.product[0].price
                }, {session})
            })

            // Remove cart
            await cartModel.deleteMany({idUser: idUser}, {session});

            await session.commitTransaction();
            await session.endSession();
            return response(res, true, "Create order successfully", 201, newOrder);
        } catch (e) {
            await session.abortTransaction();
            await session.endSession();

            if (newOrder) {
                await orderModel.findByIdAndDelete(newOrder._id);
            }

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

    async updateStatus(req, res) {
        try {
            const {id} = req.params;
            const {status} = req.body;

            const updateOrder = await orderModel.findByIdAndUpdate(id, {
                status
            }, {new: true});

            return response(res, true, "Update status success", 200, updateOrder);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async cancelOrder(req, res) {
        try {
            const {id: idOrder} = req.params;
            const idUser = req.user._id;

            const order = await orderModel.findOne({
                _id: idOrder,
                idUser: idUser
            });

            if (!order) return response(res, false, "Order does not exist!", 400);
            if (order.status === 2) return response(res, false, "Order cannot cancel when being shipped!", 400);
            if (order.status === 3) return response(res, false, "Order cannot cancel when delivered success!", 400);
            if (order.status === 4) return response(res, false, "Order was cancelled!", 400);

            order.status = 4;
            order.save();

            return response(res, true, "Cancel order success", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            const deleteOrder = await orderModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Order is deleted", 200, deleteOrder);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Order();