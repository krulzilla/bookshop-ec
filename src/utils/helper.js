const bcrypt = require("bcrypt");

const hashString = (data) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(data, salt);
}

const compareHash = (rootString, hash) => {
    return bcrypt.compareSync(rootString, hash);
}

module.exports = {
    hashString,
    compareHash,
}