const {Schema, model} = require("mongoose");

const FeedbackSchema = new Schema({
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
    comment: {
        type: String,
        trim: true,
        default: ""
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

FeedbackSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

FeedbackSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
    next();
});

module.exports = model("Feedback", FeedbackSchema);