const {Schema, model} = require("mongoose");

const WishlistSchema = new Schema({
    idProduct: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: [true, "Product id is required"]
    },
    idOwner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Owner id is required"]
    }
}, {
    timestamps: true
});


module.exports = model("Wishlist", WishlistSchema);