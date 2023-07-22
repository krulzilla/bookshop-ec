const router = require("express").Router();
const adminMiddleware = require("../controllers/auth/admin.auth");

// Import routes
const dashboardController = require("../controllers/admin/dashboard.controller");
const authController = require("../controllers/admin/auth.controller");
const productController = require("../controllers/admin/manageProduct.controller");
const typeTransportController = require("../controllers/admin/typeTransport.controller");
const orderController = require("../controllers/admin/order.controller");
const profileController = require("../controllers/admin/profile.controller");
const userController = require("../controllers/admin/user.controller");
const receiptController = require("../controllers/admin/warehouse.controller");

// Manage routes
router.get("/login", adminMiddleware.isNotAdmin, authController.renderLoginPage);

router.use(adminMiddleware.isAdmin);
router.get("/", dashboardController.renderDashboardPage);
router.get("/logout", authController.logout);
router.get("/product", productController.renderProductPage);
router.get("/category", productController.renderCategoryPage);
router.get("/author", productController.renderAuthorPage);
router.get("/publisher", productController.renderPublisherPage);
router.get("/type-transport", typeTransportController.renderTransportPage);
router.get("/order", orderController.renderOrderPage);
router.get("/profile", profileController.renderPageProfile);
router.get("/customer", userController.renderCustomerPage);
router.get("/staff", userController.renderStaffPage);
router.get("/import-warehouse", receiptController.renderImportWarehousePage);
router.get("/warehouse-receipt", receiptController.renderWarehouseReceiptPage);

module.exports = router;