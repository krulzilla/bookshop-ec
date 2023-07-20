const {uiRender: render} = require("../../utils/customResponse");
const categoryModel = require("../../models/category.model");
const authorModel = require("../../models/author.model");
const publisherModel = require("../../models/publisher.model");

class ManageProduct {
    async renderProductPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            const [category, author, publisher] = await Promise.all([
                categoryModel.find(),
                authorModel.find(),
                publisherModel.find()
            ]);

            return render(res, "admin-product", {name: "Product", user: req.user, search, category, author, publisher}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
    async renderCategoryPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-category", {name: "Category", user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }

    async renderAuthorPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-author", {name: "Author", user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }

    async renderPublisherPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-publisher", {name: "Publisher", user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new ManageProduct();