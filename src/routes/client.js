const express = require("express");
const router = express.Router();

// Import routes
const landingController = require("../controllers/client/landing.controller");
const productController = require("../controllers/client/product.controller");

// Manage routes
router.get("/", landingController.renderLandingPage);
router.get("/products", productController.renderProductPage);
router.get("/product/:id", productController.renderDetailPage);

module.exports = router;