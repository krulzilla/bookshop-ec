const router = require("express").Router();

// Import routes
const dashboardController = require("../controllers/admin/dashboard.controller");

// Manage routes
router.get("/", dashboardController.renderDashboardPage);

module.exports = router;