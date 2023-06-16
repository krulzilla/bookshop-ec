const {Schema, model} = require("mongoose");

const PublisherSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    description: {
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

PublisherSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

module.exports = model("Publisher", PublisherSchema);