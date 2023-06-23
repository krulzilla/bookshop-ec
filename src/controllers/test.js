const {uiRender: render} = require("../utils/customResponse");

class Test {
    async index(req, res) {
        return render(res, "test2", [], false);
    }
}

module.exports = new Test();