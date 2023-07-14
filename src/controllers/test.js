const {apiResponse: response} = require("../utils/customResponse");
const {Types} = require("mongoose");
const cartModel = require("../models/cart.model");


class Test {
    async index(req, res) {
        const userId = req.body.idUser ?? req.user._id;

        console.log(req.body.idUser, req.user._id);

        return response(res, true, "Success", 200, userId);
    }
}

module.exports = new Test();