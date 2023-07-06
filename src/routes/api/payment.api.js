const router = require("express").Router();
const paypalController = require("../../controllers/api/paypal/paypal.controller");

router.post("/create-paypal-order", paypalController.createOrder);
router.post("/capture-paypal-order", paypalController.captureOrder);

module.exports = router;