const {Schema, model} = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        unique: [true, "{VALUE} has been used!"],
        required: [true, "Username is required"],
        trim: true,
    },
    password : {
        type: String,
        required: [true, "Password is required"],
        trim: true,
    },
    email: {
        type: String,
        // unique: [true, "{VALUE} has been used!"],
        // required: [true, "Email is required"],
        trim: true,
        default: null
    },
    github: {
        type: String,
        trim: true,
        default: null
    },
    fullname: {
        type: String,
        trim: true,
        default: "Anonymous client " + Date.now().toString().slice(-4)
    },
    age: {
        type: Number,
        default: null
    },
    address: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        trim: true,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
        required: [true, "Role is required"],
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

UserSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

module.exports = model("User", UserSchema);