const wishlistModel = require("../../models/wishlist.model");
const {apiResponse:response} = require("../../utils/customResponse");

class Wishlist {
    async getAll(req, res) {
        try {
            const wishlists = await wishlistModel.find({});

            return response(res, true, "Get wishlists successfully", 200, wishlists);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getByUser(req, res) {
        try {
            const idUser = req.user._id;

            const wishlists = await wishlistModel.find({idOwner: idUser});

            return response(res, true, "Get wishlist successfully", 200, wishlists);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async getById(req, res) {
        try {
            const {id} = req.params;

            const wishlist = await wishlistModel.findOne({_id: id});

            return response(res, true, "Get wishlist successfully", 200, wishlist);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    async create(req, res) {
        try {
            const {idProduct} = req.body;
            const idUser = req.body.idUser || req.user._id;

            // Check if wishlist is existed
            const wishlist = await wishlistModel.findOne({
                idProduct,
                idOwner: idUser
            })

            if (wishlist) return response(res, false, "This product was in wishlist already!", 200);

            const newWishlist = await wishlistModel.create({
                idProduct,
                idOwner: idUser
            });

            return response(res, true, "Add to my wishlist successfully", 201, newWishlist);
        } catch (e) {
            if (e.name === "ValidationError") {
                let errMsg;
                Object.keys(e.errors).forEach((key) => {
                    errMsg = e.errors[key].message;
                });
                return response(res, false, errMsg, 400);
            }
            return response(res, false, "Somethings went wrong!", 500);
        }

    }

    async delete(req, res) {
        try {
            const {id: idProduct} = req.params;
            const idUser = req.body.idUser || req.user._id;

            const deleteWishlist = await wishlistModel.findOneAndDelete({
                idProduct,
                idOwner: idUser
            });

            return response(res, true, "Wishlist is deleted");
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new Wishlist();