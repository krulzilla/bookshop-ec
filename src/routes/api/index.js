const express = require("express");
const router = express.Router();

// Import api routes
const categoryApi = require("./category.api");
const authorApi = require("./author.api");
const publisherApi = require("./publisher.api");
const productApi = require("./product.api");

// Manage api routes
router.use("/category", categoryApi);
router.use("/author", authorApi);
router.use("/publisher", publisherApi);
router.use("/product", productApi);

module.exports = router;