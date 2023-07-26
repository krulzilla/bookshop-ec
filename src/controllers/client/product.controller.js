const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");
const categoryModel = require("../../models/category.model");
const productModel = require("../../models/product.model");
const feedbackModel = require("../../models/feedback.model");
const orderDetailModel = require("../../models/orderDetail.model");
const {Types} = require("mongoose");

class Product {
    async renderProductPage(req, res, next) {
        const {category = [], search = "", price = ""} = req.query;
        try {
            const categories = await categoryModel.find();

            const pagination = {
                filterCategory: category,
                filterPrice: price,
            }
            return render(res, "client-product", {name: "Products", user: req.user, category: categories, search, pagination});
        } catch (e) {
            next({status: 500});
        }
    }

    async renderDetailPage(req, res, next) {
        try {
            const {id} = req.params;

            const product = await productModel.findById(id)
                .populate("idCategory", "name")
                .populate("idAuthor", "name -_id")
                .populate("idPublisher", "name -_id")
                .select("name publishedAt amount price sale image description");

            const productSold = await orderDetailModel.aggregate([
                {
                    $match: {
                        idProduct: new Types.ObjectId(id),
                    },
                },
                {
                    $group: {
                        _id: "$idProduct",
                        totalSold: {$sum: "$amount"}
                    }
                }
            ])
            let amountSold = 0;
            if (productSold.length !== 0) amountSold = productSold[0].totalSold;
            const amountComment = await feedbackModel.find({
                idProduct: id
            }).count();

            return render(res, "client-product_detail", {name: "Product details", user: req.user, product, amountSold, amountComment});
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Product();