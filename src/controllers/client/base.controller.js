const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");

class Base {
    constructor() {
        this.render = render;
        this.response = response;
    }
}

module.exports = Base;