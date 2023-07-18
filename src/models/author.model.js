const {Schema, model} = require("mongoose");

const AuthorSchema = new Schema({
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

AuthorSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

AuthorSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { isDeleted: false } });
    next();
});

module.exports = model("Author", AuthorSchema);