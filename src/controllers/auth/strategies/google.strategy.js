const googleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../../../models/user.model");
const roleModel = require("../../../models/role.model");
const {hashString} = require("../../../utils/helper");

module.exports = new googleStrategy(
    {
        clientID: "1076703272866-30lprs99i3e1cjkp215c0m7kq0g96lmr.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
        // const email = profile.emails[0].value;

        let email = "";
        if (profile.emails) {
            email = profile.emails[0].value;
        }

        return cb(null, {
            email: email,
            displayName: profile.displayName ?? null,
        })

        // const user = await userModel.findOne({email});
        //
        // if (!user) {
        //     // If user didn't register before
        //     const username = "anonymous_user_" + Date.now().toString().slice(-4) + Math.ceil(Math.random() * 10000);
        //     const password = Math.ceil(Math.random() * 10000) + Date.now().toString().slice(-6);
        //     const fullname = profile.displayName ?? null;
        //     const role = await roleModel.findOne({name: "Client"}).select("_id");
        //
        //     const newUser = await userModel.create({
        //         username,
        //         password: hashString(password),
        //         email,
        //         fullname,
        //         role: role._id,
        //         authBySocial: true
        //     })
        //
        //     return cb(null, newUser);
        // } else {
        //     if (!user.isActive) return cb(null, false, {message: "Your account is currently unavailable!"});
        //
        //     return cb(null, user);
        // }
    }
)