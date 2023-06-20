const {uiRender: render} = require("../utils/customResponse");

class Test {
    async index(req, res) {
        return render(res, "test", [], false);
    }
}

module.exports = new Test();