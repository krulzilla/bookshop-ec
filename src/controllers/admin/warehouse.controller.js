const {uiRender: render} = require("../../utils/customResponse");
const productModel = require("../../models/product.model");

class Warehouse {
    async renderWarehouseReceiptPage(req, res, next) {
        try {
            const {search} = req.query;
            const products = await productModel.find().select("name");

            return render(res, "admin-warehouse_receipt", {name: "Warehouse receipt", user: req.user, search, products}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }

    async renderImportWarehousePage(req, res, next) {
        try {
            const products = await productModel.find().select("name");

            return render(res, "admin-import_warehouse", {name: "Warehouse receipt", user: req.user, products}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new Warehouse();