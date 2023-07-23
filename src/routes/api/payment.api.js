const router = require("express").Router();
const paypalController = require("../../controllers/api/paypal/paypal.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.post("/create-paypal-order", authMiddleware.isUser, paypalController.createOrder);
router.post("/capture-paypal-order", authMiddleware.isUser, paypalController.captureOrder);

module.exports = router;