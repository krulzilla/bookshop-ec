const {Schema, model} = require("mongoose");

/*
* Order status cheatsheet
* > 0 = Order has been placed
* > 1 = Order is being prepared
* > 2 = Order is being shipped
* > 3 = Order has been shipped successfully
* > 4 = Order was canceled
* */

const OrderSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Id User is required"],
        trim: true
    },
    total: {
        type: Number,
        required: [true, "Total is required"]
    },
    status: {
        type: Number,
        default: 0
    },
    typeTransport: {
        type: Schema.Types.ObjectId,
        ref: "Type Transport",
        required: [true, "Type Transport is required"],
        trim: true
    },
    shippingFee: {
        type: Number,
        required: [true, "Shipping fee is required"],
        trim: true
    },
    typePayment: {
        type: Schema.Types.ObjectId,
        ref: "Type Payment",
        required: [true, "Type Payment is required"],
        trim: true
    },
    idPaypalInvoice: {
        type: String,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

OrderSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

module.exports = model("Order", OrderSchema);