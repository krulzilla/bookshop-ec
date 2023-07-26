const {uiRender: render} = require("../../utils/customResponse");
const wishlistModel = require("../../models/wishlist.model");
const {Types} = require("mongoose");

class Wishlist {
    async renderWishlistProfile(req, res, next) {
        try {
            const idUser = req.user._id;

            const wishlist = await wishlistModel.aggregate([
                {
                    $match: {
                        idOwner: new Types.ObjectId(idUser),
                    },
                },
                {
                    $sort: {
                        createdAt: -1
                    }
                },
                {
                    $lookup: {
                        from: "products",
                        let: { idProduct: "$idProduct" },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: ["$_id", "$$idProduct"],
                                    },
                                },
                            },
                            {
                                $match: {
                                    isDeleted: false
                                }
                            },
                            {
                                $lookup: {
                                    from: "categories",
                                    localField: "idCategory",
                                    foreignField: "_id",
                                    as: "category",
                                },
                            },
                            {
                                $lookup: {
                                    from: "authors",
                                    localField: "idAuthor",
                                    foreignField: "_id",
                                    as: "author",
                                },
                            }
                        ],
                        as: "product",
                    },
                },
                { $unwind: "$product" },
                {
                    $project: {
                        product: {
                            _id: 1,
                            name: 1,
                            image: 1,
                            price: 1,
                            sale: 1,
                            amount: 1,
                            category: {
                                name: 1
                            },
                            author: {
                                _id: 1,
                                name: 1
                            }
                        }
                    }
                }
            ]);

            return render(res, "client-wishlist", {name: "My Wishlist" , user: req.user, wishlist});
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Wishlist();