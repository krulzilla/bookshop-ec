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
        let email = "";
        if (profile.emails) {
            email = profile.emails[0].value;
        }

        return cb(null, {
            github: profile.profileUrl,
            email: email,
            displayName: profile.displayName ?? null,
        })
    }
)

