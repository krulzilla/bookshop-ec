const {Schema, model} = require("mongoose");

const RoleSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        unique: [true, "Role \"{VALUE}\" is existed"],
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

RoleSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

module.exports = model("Role", RoleSchema);