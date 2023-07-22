const {apiResponse: response} = require("../../utils/customResponse");
const mongoose = require("mongoose");
const warehouseReceiptModel = require("../../models/warehouseReceipt.model");
const warehouseReceiptDetailModel = require("../../models/warehouseReceiptDetail.model");
const productModel = require("../../models/product.model");

class Warehouse {
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
}

module.exports = new Warehouse();