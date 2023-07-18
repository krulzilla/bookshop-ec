const router = require("express").Router();
const adminMiddleware = require("../controllers/auth/admin.auth");

// Import routes
const dashboardController = require("../controllers/admin/dashboard.controller");
const authController = require("../controllers/admin/auth.controller");
const productController = require("../controllers/admin/manageProduct.controller");
const typeTransportController = require("../controllers/admin/typeTransport.controller");

// Manage routes
router.get("/", adminMiddleware.isAdmin, dashboardController.renderDashboardPage);
router.get("/login", adminMiddleware.isNotAdmin, authController.renderLoginPage);
router.get("/logout", adminMiddleware.isAdmin, authController.logout);
router.get("/category", adminMiddleware.isAdmin, productController.renderCategoryPage);
router.get("/author", adminMiddleware.isAdmin, productController.renderAuthorPage);
router.get("/publisher", adminMiddleware.isAdmin, productController.renderPublisherPage);
router.get("/type-transport", adminMiddleware.isAdmin, typeTransportController.renderTransportPage);

module.exports = router;