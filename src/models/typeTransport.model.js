const {Schema, model} = require("mongoose");

const TypeTransportSchema = new Schema({
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
    price: {
        type: Number,
        required: [true, "Price is required"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

TypeTransportSchema.pre(["find", "findOne"], function() {
    this.where({isDeleted: false});
})

module.exports = model("Type Transport", TypeTransportSchema);