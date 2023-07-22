const router = require("express").Router();
const staffMiddleware = require("../controllers/auth/staff.auth");

// Import routes
const authController = require("../controllers/staff/auth.controller");
const orderController = require("../controllers/staff/order.controller");
const receiptController = require("../controllers/staff/warehouse.controller");
const profileController = require("../controllers/staff/profile.controller");

// Manage routes
router.get("/login", staffMiddleware.isNotStaff, authController.renderLoginPage);

router.use(staffMiddleware.isStaff);
router.get("/", (req, res) => res.redirect("/staffcp/order"));
router.get("/logout", authController.logout);
router.get("/profile", profileController.renderPageProfile);
router.get("/order", orderController.renderOrderPage);
router.get("/import-warehouse", receiptController.renderImportWarehousePage);

module.exports = router;