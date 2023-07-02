const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");

class Landing {
    renderLandingPage(req, res, next) {
        try {
            return render(res, "client-landing", {user: req.user}, false);
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Landing();