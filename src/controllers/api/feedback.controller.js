const feedbackModel = require("../../models/feedback.model");
const productModel = require("../../models/product.model");
const orderModel = require("../../models/order.model");
const orderDetailModel = require("../../models/orderDetail.model");
const {apiResponse:response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");
const mongoose = require("mongoose");

class Feedback {
    async getAll(req, res) {
        try {
            const feedbacks = await feedbackModel.find({});

            return response(res, true, "Get feedbacks successfully", 200, feedbacks);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const feedback = await feedbackModel.findOne({_id: id});

            return response(res, true, "Get feedback successfully", 200, feedback);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getByOrderId(req, res) {
        try {
            const {id: idOrder} = req.params;

            const feedbacks = await feedbackModel.find({
                idOrder
            }).populate("idProduct", "name image").select("comment createdAt");

            return response(res, true, "Get feedback successfully", 200, feedbacks);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async pagination(req, res) {
        try {
            const {id: idProduct} = req.params;
            let {page = 1, pageSize = 10} = req.query;
            // Exec query
            const pipelines = [
                {
                    $match: {
                        idProduct: new mongoose.Types.ObjectId(idProduct)
                    }
                },
                {
                    $lookup: {
                        from: "orders",
                        localField: "idOrder",
                        foreignField: "_id",
                        as: "order"
                    }
                },
                {
                    $lookup: {
                        from: "users",
                        localField: "order.idUser",
                        foreignField: "_id",
                        as: "user"
                    }
                },
                {
                    $unwind: "$order"
                },
                {
                    $unwind: "$user"
                },
                {
                    $project: {
                        comment: 1,
                        createdAt: 1,
                        "user.fullname": 1
                    }
                }
            ]

            const feedbacks = await customPagination(feedbackModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, feedbacks);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const {id: idOrder} = req.params;
            const {idProduct, comment} = req.body;
            const idUser = req.user._id;
            const feedback = [];

            // Validate if user owned order id
            const order = await orderModel.findOne({
                _id: idOrder,
                idUser
            })
            if (!order) return response(res, true, "Id order is not valid!", 400);

            // Validate products in order & was rated or not then exec save comment.
            for (let i = 0; i < idProduct.length; i ++) {
                const orderDetail = await orderDetailModel.findOne({
                    idOrder,
                    idProduct: idProduct[i]
                })
                if (!orderDetail) {
                    return response(res, true, "Product is not in order!", 400);
                }

                const feedbackProduct = await feedbackModel.findOne({
                    idOrder,
                    idProduct: idProduct[i]
                })
                if (feedbackProduct) {
                    return response(res, true, "Product has been rated already!", 400);
                }

                feedback.push({
                    idOrder,
                    idProduct: idProduct[i],
                    comment: comment[i]
                })
            }

            await feedbackModel.insertMany(feedback, {session});
            await session.commitTransaction();
            await session.endSession();

            return response(res, true, "Save feedback success", 201);
        } catch (e) {
            await session.abortTransaction();
            await session.endSession();
            return response(res, false, "Somethings went wrong!", 500);
        }

    }
}

module.exports = new Feedback();