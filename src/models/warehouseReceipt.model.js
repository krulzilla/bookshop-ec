const {Schema, model} = require("mongoose");

const WarehouseReceiptSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Id user is required!"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

WarehouseReceiptSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

WarehouseReceiptSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
    next();
});

module.exports = model("Warehouse Receipt", WarehouseReceiptSchema);