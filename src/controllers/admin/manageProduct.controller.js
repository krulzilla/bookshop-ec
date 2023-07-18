const {uiRender: render} = require("../../utils/customResponse");

class ManageProduct {
    async renderCategoryPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-category", {user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }

    async renderAuthorPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-author", {user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }

    async renderPublisherPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-publisher", {user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new ManageProduct();