const {Schema, model} = require("mongoose");

const OrderDetailSchema = new Schema({
    idOrder: {
        type: Schema.Types.ObjectId,
        ref: "Order",
        required: [true, "Order id is required"]
    },
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product id is required"]
    },
    amount: {
        type: Number,
        default: 1,
    },
    price: { // Price of product at the time purchasing
        type: Number,
        required: [true, "Price product is required"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

OrderDetailSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

module.exports = model("Order Detail", OrderDetailSchema);