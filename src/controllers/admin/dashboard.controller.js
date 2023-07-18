const {uiRender: render} = require("../../utils/customResponse");

class Dashboard {
    async renderDashboardPage(req, res, next) {
        try {
            return render(res, "dashboard", {}, "admin_layout");
        } catch (e) {
            return next({status: 500});
        }
    }
}

module.exports = new Dashboard();