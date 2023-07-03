const userModel = require("../../models/user.model");
const {apiResponse: response} = require("../../utils/customResponse");

class User {
    async updateInfo(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;
            const {fullname, age, address, phone} = req.body;

            const user = await userModel.findByIdAndUpdate(idUser, {
                fullname,
                age,
                address,
                phone
            });

            return response(res, true, "Update information successfully!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new User();