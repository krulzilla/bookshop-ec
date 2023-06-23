const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");
const categoryModel = require("../../models/category.model");

class Product {
    async renderProductPage(req, res, next) {
        const {category = [], search = ""} = req.query;
        try {
            const categories = await categoryModel.find();

            const pagination = {
                filterCategory: category,
                filterSearch: search
            }
            return render(res, "client-product", {name: "Products", category: categories, pagination});
        } catch (e) {
            next(e);
        }
    }

    async renderDetailPage(req, res) {
        return render(res, "client-product_detail");
    }
}

module.exports = new Product();