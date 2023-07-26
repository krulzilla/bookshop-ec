const {apiResponse: response} = require("../../utils/customResponse");
const customPagination = require("../../utils/customPagination");
const mongoose = require("mongoose");
const warehouseReceiptModel = require("../../models/warehouseReceipt.model");
const warehouseReceiptDetailModel = require("../../models/warehouseReceiptDetail.model");
const productModel = require("../../models/product.model");

class Warehouse {
    async getDetailById(req, res) {
        try {
            const id = req.params.id;

            const receipt = await warehouseReceiptModel.aggregate([
                {
                    $match: {
                        _id: new mongoose.Types.ObjectId(id)
                    }
                },
                {
                    $lookup : {
                        from: "users",
                        localField: "idUser",
                        foreignField: "_id",
                        as: "importer"
                    }
                },
                {
                    $unwind: "$importer"
                },
                {
                    $lookup: {
                        from: "warehouse receipt details",
                        let: { receiptId: "$_id" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$idReceipt", "$$receiptId"]
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
                        as: "receiptDetails"
                    }
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        importer: {
                            username: 1,
                            fullname: 1,
                            role: 1,
                        },
                        receiptDetails: {
                            amount: 1,
                            "product.name": 1,
                            "product.image": 1
                        }
                    }
                }
            ]);

            return response(res, true, "Get receipt success", 200, receipt);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async importWarehouse(req, res) {
        // Create mongodb session for transaction
        const session = await mongoose.startSession();
        session.startTransaction();
        let warehouseReceipt;

        try {
            const {products, amount} = req.body;
            const importer = req.user._id;

            if (products.length !== amount.length) return response(res, false, "Input data is invalid!", 400);

            // Exec store in db
            warehouseReceipt = await warehouseReceiptModel.create({
                idUser: importer,
            })

            const receiptDetail = [];
            for (let i = 0; i < products.length; i ++) {
                receiptDetail.push({idReceipt: warehouseReceipt._id, idProduct: products[i], amount: amount[i]});
                // Update amount product
                await productModel.findByIdAndUpdate(products[i], {
                    $inc: {amount: amount[i]}
                }, {session});
            }

            await warehouseReceiptDetailModel.insertMany(receiptDetail, {session});

            await session.commitTransaction();
            await session.endSession();

            return response(res, true, "Imported successfully", 201);
        } catch (e) {
            await session.abortTransaction();
            await session.endSession();

            if (warehouseReceipt) {
                await warehouseReceiptModel.findByIdAndDelete(warehouseReceipt._id);
            }

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
                        from: "users",
                        foreignField: "_id",
                        localField: "idUser",
                        as: "importer"
                    }
                },
                {
                    $sort: {createdAt: -1}
                },
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        importer: {
                            _id: 1,
                            fullname: 1
                        }
                    }
                }
            ]

            const receipts = await customPagination(warehouseReceiptModel, page, +pageSize, pipelines);

            return response(res, true, "Action success", 200, receipts);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async delete(req, res) {
        try {
            const {id} = req.params;

            const deleteReceipt = await warehouseReceiptModel.findByIdAndUpdate(id, {
                isDeleted: true
            }, {new: true});

            return response(res, true, "Receipt is deleted", 200, deleteReceipt);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Warehouse();