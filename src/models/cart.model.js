const {Schema, model} = require("mongoose");

const CartSchema = new Schema({
    idUser: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Id user is required!"]
    },
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Id product is required!"]
    },
    amount: {
        type: Number,
        default: 1
    }
}, {
    timestamps: true
})

CartSchema.pre(['find', 'findOne'], function () {
    this.where({amount: { $gt: 0 }});
})

module.exports = model("Cart", CartSchema);