const {apiResponse: response, uiRender: render} = require("../../utils/customResponse");
const userModel = require("../../models/user.model");

class Profile {
    async renderPageProfile(req, res, next) {
        try {
            const idUser = req.user._id;

            const user = await userModel.findById(idUser).populate("role", "name").select("-password");

            return render(res, "client-profile", {name: "My Account" , user: req.user, profile: user});
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = new Profile();