const userModel = require("../../models/user.model");
const {apiResponse: response} = require("../../utils/customResponse");
const {hashString, compareHash} = require("../../utils/helper");

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

    async changePassword(req, res) {
        try {
            const idUser = req.body.idUser ?? req.user._id;
            const {password, newPassword, confirmPassword} = req.body;

            // Check new password == confirm password
            if (newPassword !== confirmPassword) return response(res, false, "Confirm password is incorrect!", 400);

            // Check current password is correct
            const currentUser = await userModel.findById(idUser).select("password");

            if (!compareHash(password, currentUser.password)) return response(res, false, "Current password is incorrect!", 400);

            // Change password
            const newUser = await userModel.findByIdAndUpdate(idUser, {
                password: hashString(newPassword)
            });

            return response(res, true, "Change password successfully!", 200);
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