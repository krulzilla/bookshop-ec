const {Schema, model} = require("mongoose");

const WarehouseReceiptDetailSchema = new Schema({
    idReceipt: {
        type: Schema.Types.ObjectId,
        ref: "Warehouse receipt",
        required: [true, "Id receipt is required!"]
    },
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Id product is required!"]
    },
    amount: {
        type: Number,
        required: [true, "Amount product is required!"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

WarehouseReceiptDetailSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

WarehouseReceiptDetailSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
    next();
});

module.exports = model("Warehouse Receipt Detail", WarehouseReceiptDetailSchema);