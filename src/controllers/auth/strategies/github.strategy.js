const githubStrategy = require("passport-github2").Strategy;
const userModel = require("../../../models/user.model");
const roleModel = require("../../../models/role.model");
const {hashString} = require("../../../utils/helper");

module.exports = new githubStrategy(
    {
        clientID: "3250e22172fff94cf83c",
        clientSecret: "ef4603175daf079199df6607d6e05dcbec47f9aa",
        callbackURL: "/api/auth/github/callback"
    },
    async (accessToken, refreshToken, profile, cb) => {
        const github = profile.profileUrl;
        const email = profile.emails[0].value ?? null;

        let user = await userModel.findOne({
            $or: [{github}, {email}]
        })

        if (!user) {
            // If user didn't register before
            const username = "anonymous_user_" + Date.now().toString().slice(-4) + Math.ceil(Math.random() * 10000);
            const password = Math.ceil(Math.random() * 10000) + Date.now().toString().slice(-6);
            const fullname = profile.displayName ?? null;
            const role = await roleModel.findOne({name: "Client"}).select("_id");

            const newUser = await userModel.create({
                username,
                password: hashString(password),
                email,
                github,
                fullname,
                role: role._id
            })

            return cb(null, newUser);
        } else {
            if (!user.isActive) return cb(null, false, {message: "Your account is currently unavailable!"});
            if (!user.github) user = await userModel.findByIdAndUpdate(user._id, {github}, {new: true});

            return cb(null, user);
        }

        return cb(null, true);
    }
)

