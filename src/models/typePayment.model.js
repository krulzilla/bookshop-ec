const {Schema, model} = require("mongoose");

const TypePaymentSchema = new Schema({
    name: {
        type: String,
        trim: true,
        unique: [true, "{VALUE} is in used"],
    },
    description: {
        type: String,
        trim: true,
        default: ""
    },
    image: {
        type: String,
        required: [true, "Image is required"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

TypePaymentSchema.pre(["find", "findOne"], function() {
    this.where({isDeleted: false});
})

module.exports = model("Type Payment", TypePaymentSchema);