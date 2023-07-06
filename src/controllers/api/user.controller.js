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

    // Fn to check shipping info of user (fullName, phone, address)
    async haveShippingInfo(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;

            const user = await userModel.findById(idUser);

            if (!user.fullname || !user.address || !user.phone) {
                return response(res, false, "Missing shipping information, please update your information before complete order!", 400);
            }

            return response(res, true, "Can create order!", 200);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = new User();