const passport = require("passport");
const localStrategy = require("./local.strategy");

const middlewarePassport = () => {
    passport.use(localStrategy);
}

module.exports = middlewarePassport();