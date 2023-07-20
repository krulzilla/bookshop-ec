const {Schema, model, isValidObjectId} = require("mongoose");

const ProductSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    idCategory: {
        type: [Schema.Types.ObjectId],
        ref: "Category",
        validate: [
            {
                validator: function (ids) {
                    return ids.length > 0;
                },
                message: 'Category is required.'
            },
            {
                validator: function (ids) {
                    return ids.every((id, index, array) => array.indexOf(id) === index);
                },
                message: 'Category must have unique values.'
            }
        ],
        trim: true
    },
    idAuthor: {
        type: [Schema.Types.ObjectId],
        ref: "Author",
        validate: [
            {
                validator: function (ids) {
                    return ids.length > 0;
                },
                message: 'Author is required.'
            },
            {
                validator: function (ids) {
                    return ids.every((id, index, array) => array.indexOf(id) === index);
                },
                message: 'Author must have unique values.'
            }
        ],
        trim: true
    },
    idPublisher: {
        type: Schema.Types.ObjectId,
        ref: "Publisher",
        trim: true,
        required: [true, "Publisher is required"]
    },
    publishedAt: {
        type: Date,
        required: [true, "Published year is required"]
    },
    amount: {
        type: Number,
        default: 0
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
    sale: {
        type: Number,
        default: 0,
        trim: true
    },
    image: {
        type: String,
        default: "productNoImage",
        trim: true,
        validate: {
            validator: function (img) {
                return /.+\.(jpg|png|jpeg)/g.test(img);
            },
            message: "Image type is invalid"
        }
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

ProductSchema.pre(["find", "findOne"], function () {
    this.where({isDeleted: false});
});

module.exports = model("Product", ProductSchema);