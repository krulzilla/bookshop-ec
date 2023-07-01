const passport = require("passport");
const {apiResponse: response} = require("../../utils/customResponse");
const {hashString, compareHash} = require("../../utils/helper");
const roleModel = require("../../models/role.model");
const userModel = require("../../models/user.model");

class BaseAuth {
    constructor(role = "Client") {
        this.role = role;
    }

    register = async (req, res) => {
        try {
            const { username, password, rePassword } = req.body;

            if (password !== rePassword) return response(res, false, "The confirm password does not match!", 400);


            const roleName = this.role;
            const role = await roleModel.findOne({name: roleName}).select("_id name");
            const hashPassword = hashString(password);

            const newUser = await userModel.create({
                username,
                password: hashPassword,
                role: role._id
            })

            return response(res, true, "You registered successfully!", 201, newUser);
        } catch (e) {
            if (e.name === "ValidationError") {
                let errMsg;
                Object.keys(e.errors).forEach((key) => {
                    errMsg = e.errors[key].message;
                });
                return response(res, false, errMsg, 400);
            } else if (e.name === "MongoServerError" && e.code === 11000) {
                return response(res, false, `Username '${e.keyValue.username}' has been used!`, 400);
            }
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    login = async(req, res, next) => {
        try {
            passport.authenticate("local", {session: false}, (err, user, info) => {
                console.log(err, user, info);
                if (err || !user) return response(res, false, info.message, 401);

                return response(res, true, "Login success");
            })(req, res, next);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }
}

module.exports = BaseAuth;