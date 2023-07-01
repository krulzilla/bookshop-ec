const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const hashString = (data) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
}

const compareHash = (rootString, hash) => {
    return bcrypt.compareSync(rootString, hash);
}

const signToken = (data) => {
    const signedToken = jwt.sign(data, process.env.SECRET_JWT, {expiresIn: '2h'});

    return `Bearer ${signedToken}`;
}

const verifyToken = (token) => {
    try {
        const rawToken = token.split(" ")[1];

        const data = jwt.verify(rawToken, process.env.SECRET_JWT);

        return data;
    } catch (e) {
        return false;
    }
}

module.exports = {
    hashString,
    compareHash,
    signToken,
    verifyToken,
}