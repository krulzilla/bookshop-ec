const passport = require("passport");
const {apiResponse: response} = require("../../utils/customResponse");
const {hashString, compareHash, signToken, verifyToken} = require("../../utils/helper");
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

            const role = await roleModel.findOne({name: this.role}).select("_id name");
            const hashPassword = hashString(password);

            const newUser = await userModel.create({
                username,
                password: hashPassword,
                role: role._id
            })

            // Generate jwt token & set in cookie
            const accessToken = signToken({userId: newUser._id});

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 2 * 60 * 60 * 1000
            });
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
                if (err || !user) return response(res, false, info.message, 401);

                // Generate jwt token & set in cookie
                const accessToken = signToken({userId: user._id});

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000
                });
                return response(res, true, "Login successfully!");
            })(req, res, next);
        } catch (e) {
            return response(res, false, "Somethings went wrong!", 500);
        }
    }

    googleAuth = async (req, res, next) => {
        passport.authenticate("google", {scope: ['email', 'profile']})(req, res, next);
    }

    googleAuthCallback = async (req, res, next) => {
        try {
            passport.authenticate("google", {session: false}, (err, user, info) => {
                if (err || !user) return response(res, false, info.message, 401);

                // Generate jwt token & set in cookie
                const accessToken = signToken({userId: user._id});

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000
                });
                return res.redirect("/");
            })(req, res, next)
        } catch (e) {
            next({status: 500});
        }
    }

    githubAuth = async (req, res, next) => {
        passport.authenticate("github", {scope: ['user']})(req, res, next);
    }

    githubAuthCallback = async (req, res, next) => {
        try {
            passport.authenticate("github", {session: false}, (err, user, info) => {
                if (err || !user) return response(res, false, info.message, 401);

                // Generate jwt token & set in cookie
                const accessToken = signToken({userId: user._id});

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    maxAge: 2 * 60 * 60 * 1000
                });
                return res.redirect("/");
            })(req, res, next);
        } catch (e) {
            next({status: 500});
        }
    }

    authenticate = async (req, res, next) => {
        try {
            passport.authenticate("jwt", {session: false}, async (err, user, info) => {
                if (err || !user) {
                    // if (info && info.message === "invalid signature") {
                    //     res.clearCookie("accessToken");
                    // }
                    res.clearCookie("accessToken");
                }

                req.user = null;
                if (user) {
                    req.user = {
                        _id: user._id,
                        fullname: user.fullname,
                        role: user.role.name
                    }
                }
                next();
            })(req, res, next);
        } catch (e) {
            next({status: 500});
        }
    }
}

module.exports = BaseAuth;