const {uiRender: render} = require("../../utils/customResponse");
const productModel = require("../../models/product.model");

class Warehouse {
    async renderImportWarehousePage(req, res, next) {
        try {
            const products = await productModel.find().select("name");

            return render(res, "staff-import_warehouse", {name: "Warehouse receipt", user: req.user, products}, "staff_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new Warehouse();