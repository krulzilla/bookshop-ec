const {Schema} = require("mongoose");

const UserSchema = new Schema({
    username: {
        type: String,
        unique: [true, "{VALUE} has been used!"],
        required: [true, "Password is required"],
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
    },
    fullname: {
        type: String,
        trim: true,
        default: "Anonymous client " + Date.now().toString().slice(-4)
    },
    age: {
        type: Number
    },
    address: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        trim: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: Schema.Types.ObjectId,
        ref: "Role",
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = UserSchema;