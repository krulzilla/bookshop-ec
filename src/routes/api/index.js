const express = require("express");
const router = express.Router();

// Import api routes
const categoryApi = require("./category.api");

// Manage api routes
router.use("/category", categoryApi);

module.exports = router;