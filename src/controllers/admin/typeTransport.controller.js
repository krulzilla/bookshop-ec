const {uiRender: render} = require("../../utils/customResponse");

class TypeTransport {
    async renderTransportPage(req, res, next) {
        try {
            const {search = ""} = req.query;

            return render(res, "admin-transport", {user: req.user, search}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new TypeTransport();