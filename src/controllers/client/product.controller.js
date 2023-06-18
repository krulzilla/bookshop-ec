const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");
const categoryModel = require("../../models/category.model");

class Product {
    async renderProductPage(req, res, next) {
        try {
            const categories = await categoryModel.find();
            return render(res, "client-product", {name: "Product", category: categories});
        } catch (e) {
            next(e);
        }
    }

    async renderDetailPage(req, res) {
        return render(res, "client-product_detail");
    }
}

module.exports = new Product();