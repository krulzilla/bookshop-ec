const {Strategy: jwtStrategy, ExtractJwt} = require("passport-jwt");
const userModel = require("../../../models/user.model");

const cookieExtractor = function (req) {
    let token = null;
    if (req && req.cookies && req.cookies['accessToken']) {
        token = req.cookies['accessToken'].split(" ")[1];
    }
    return token;
};

module.exports = new jwtStrategy(
    {
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.SECRET_JWT,
    },
    async (payload, done) => {
        try {
            const user = await userModel.findById(payload.userId).populate("role", "name").select("role isActive");

            if (!user.isActive) return done(null, false, {message: "Your account is current unavailable!"});

            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }
)