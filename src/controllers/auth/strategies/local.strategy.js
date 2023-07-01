const localStrategy = require("passport-local").Strategy;
const userModel = require("../../../models/user.model");
const {compareHash} = require("../../../utils/helper");

module.exports = new localStrategy({}, async (username, password, done) => {
    try {
        const user = await userModel.findOne({username}).select("username password role isActive");

        if (!user || !compareHash(password, user.password)) return done(null, false, {message: "Username or password is incorrect!"});

        if (!user.isActive) return done(null, false, {message: "Your account is currently unavailable!"});

        return done(null, user);
    } catch (e) {
        return done(e);
    }
})