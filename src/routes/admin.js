const router = require("express").Router();
const adminMiddleware = require("../controllers/auth/admin.auth");

// Import routes
const dashboardController = require("../controllers/admin/dashboard.controller");
const authController = require("../controllers/admin/auth.controller");

// Manage routes
router.get("/", adminMiddleware.isAdmin, dashboardController.renderDashboardPage);
router.get("/login", adminMiddleware.isNotAdmin, authController.renderLoginPage);
router.get("/logout", adminMiddleware.isAdmin, authController.logout);

module.exports = router;