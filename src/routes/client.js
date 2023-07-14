const express = require("express");
const router = express.Router();

// Middleware auth
const authClient = require("../controllers/auth/client.auth");

// Import routes
const landingController = require("../controllers/client/landing.controller");
const productController = require("../controllers/client/product.controller");
const authController = require("../controllers/client/auth.controller");
const cartController = require("../controllers/client/cart.controller");

// Manage routes
router.get("/", landingController.renderLandingPage);
router.get("/products", productController.renderProductPage);
router.get("/product/:id", productController.renderDetailPage);
router.get("/login", authClient.isNotClient, authController.login);
router.get("/register", authClient.isNotClient, authController.register);
router.get("/logout", authController.logout);
router.get("/cart", authClient.isClient, cartController.cart);
router.get("/checkout", authClient.isClient, cartController.checkout);

module.exports = router;