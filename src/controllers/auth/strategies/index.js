const passport = require("passport");
const localStrategy = require("./local.strategy");
const googleStrategy = require("./google.strategy");
const githubStrategy = require("./github.strategy");
const jwtStrategy = require("./jwt.strategy");

const middlewarePassport = () => {
    passport.use(localStrategy);
    passport.use(googleStrategy);
    passport.use(githubStrategy);
    passport.use(jwtStrategy);
}

module.exports = middlewarePassport();