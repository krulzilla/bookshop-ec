const mongoose = require("mongoose");
const dbUrl = process.env.MONGO_CLOUD_URL || "mongodb://localhost/bookshop";

const connectDBConfig = () => {
    mongoose.connect(dbUrl)
        .then(() => console.log("Connected database successfully!"))
        .catch(e => console.log("Error happened when connecting database\n" + e.message))
};

module.exports = connectDBConfig;