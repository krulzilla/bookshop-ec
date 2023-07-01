const express = require("express");
const router = express.Router();

// Import api routes
const authApi = require("./auth.api");

const categoryApi = require("./category.api");
const authorApi = require("./author.api");
const publisherApi = require("./publisher.api");
const productApi = require("./product.api");
const roleApi = require("./role.api");

// Manage api routes
router.use("/auth", authApi);

router.use("/category", categoryApi);
router.use("/author", authorApi);
router.use("/publisher", publisherApi);
router.use("/product", productApi);
router.use("/role", roleApi);

module.exports = router;