const express = require("express");
const router = express.Router();

// Middleware auth
const authMiddleware = require("../controllers/auth/client.auth");

// Import routes
const landingController = require("../controllers/client/landing.controller");
const productController = require("../controllers/client/product.controller");
const authController = require("../controllers/client/auth.controller");
const cartController = require("../controllers/client/cart.controller");

// Manage routes
router.use(authMiddleware.authenticate);

router.get("/", landingController.renderLandingPage);
router.get("/products", productController.renderProductPage);
router.get("/product/:id", productController.renderDetailPage);
router.get("/login", authMiddleware.isNotClient, authController.login);
router.get("/register", authMiddleware.isNotClient, authController.register);
router.get("/logout", authController.logout);
router.get("/cart", authMiddleware.isClient, cartController.cart);
router.get("/checkout", authMiddleware.isClient, cartController.checkout);

module.exports = router;