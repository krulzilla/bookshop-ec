const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");

class Landing {
    renderLandingPage(req, res) {
        return render(res, "client-landing", [], false);
    }
}

module.exports = new Landing();