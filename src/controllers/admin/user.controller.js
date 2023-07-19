const {uiRender: render} = require("../../utils/customResponse");
const roleModel = require("../../models/role.model");

class User {
    async renderCustomerPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-customer", {name: "Customer", user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }

    async renderStaffPage(req, res, next) {
        try {
            const {search = ""} = req.query;
            const roles = await roleModel.find({
                $or:[ {name: "Admin"}, {name: "Staff"} ]
            })

            return render(res, "admin-staff", {name: "Staff", user: req.user, search, roles}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new User();