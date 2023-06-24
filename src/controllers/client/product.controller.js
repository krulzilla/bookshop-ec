const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");
const categoryModel = require("../../models/category.model");
const productModel = require("../../models/product.model");

class Product {
    async renderProductPage(req, res, next) {
        const {category = [], search = "", price = ""} = req.query;
        try {
            const categories = await categoryModel.find();

            const pagination = {
                filterCategory: category,
                filterPrice: price,
            }
            return render(res, "client-product", {name: "Products", category: categories, search, pagination});
        } catch (e) {
            next(e);
        }
    }

    async renderDetailPage(req, res) {
        const {id} = req.params;

        const product = await productModel.findById(id)
                                .populate("idCategory", "name -_id")
                                .populate("idAuthor", "name -_id")
                                .populate("idPublisher", "name -_id")
                                .select("name publishedAt amount price image description");

        return render(res, "client-product_detail", {name: "Product details", product});
    }
}

module.exports = new Product();