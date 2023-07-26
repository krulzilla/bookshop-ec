const express = require("express");
const router = express.Router();

// Middleware auth
const authClient = require("../controllers/auth/client.auth");
const cartMiddleware = require("../controllers/api/cart.controller"); // Use to check if amount of product in cart > in stock

// Import routes
const landingController = require("../controllers/client/landing.controller");
const productController = require("../controllers/client/product.controller");
const authController = require("../controllers/client/auth.controller");
const cartController = require("../controllers/client/cart.controller");
const orderController = require("../controllers/client/order.controller");
const profileController = require("../controllers/client/profile.controller");
const wishlistController = require("../controllers/client/wishlist.controller");

// Manage routes
router.get("/", landingController.renderLandingPage);
router.get("/products", productController.renderProductPage);
router.get("/product/:id", productController.renderDetailPage);
router.get("/login", authClient.isNotClient, authController.login);
router.get("/register", authClient.isNotClient, authController.register);
router.get("/logout", authController.logout);
router.get("/cart", authClient.isClient, cartController.cart);
router.get("/checkout", authClient.isClient, cartMiddleware.canCheckout, cartController.checkout);
router.get("/complete-order", authClient.isClient, orderController.completeOrder);
router.get("/my-orders", authClient.isClient, orderController.renderMyOrderPage);
router.get("/profile", authClient.isClient, profileController.renderPageProfile);
router.get("/my-wishlist", authClient.isClient, wishlistController.renderWishlistProfile);

module.exports = router;