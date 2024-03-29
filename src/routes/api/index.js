const express = require("express");
const router = express.Router();
const authMiddleware = require("../../middlewares/auth.middlware");

// Import api routes
const authApi = require("./auth.api");

const categoryApi = require("./category.api");
const authorApi = require("./author.api");
const publisherApi = require("./publisher.api");
const productApi = require("./product.api");
const roleApi = require("./role.api");
const userApi = require("./user.api");
const cartApi = require("./cart.api");
const typeTransportApi = require("./typeTransport.api");
const typePaymentApi = require("./typePayment.api");
const paymentApi = require("./payment.api");
const orderApi = require("./order.api");
const warehouseApi = require("./warehouse.api");
const feedbackApi = require("./feedback.api");
const wishlistApi = require("./wishlist.api");

// Manage api routes
router.use("/auth", authApi);

router.use("/category", authMiddleware.isAdmin, categoryApi);
router.use("/author", authMiddleware.isAdmin, authorApi);
router.use("/publisher", authMiddleware.isAdmin, publisherApi);
router.use("/product", productApi);
router.use("/role", authMiddleware.isAdmin, roleApi);
router.use("/user", userApi);
router.use("/cart", cartApi);
router.use("/typeTransport", authMiddleware.isAdmin, typeTransportApi);
router.use("/typePayment", authMiddleware.isAdmin, typePaymentApi);
router.use("/payment", paymentApi);
router.use("/order", orderApi);
router.use("/warehouse", warehouseApi);
router.use("/feedback", feedbackApi);
router.use("/wishlist", wishlistApi);

router.use((req, res, next) => {
    next({
        status: 404,
        msg: "API not found"
    })
})

router.use((err, req, res, next) => {
    if (err.status === 404) {
        return res.status(404).json({
            msg: err.msg
        })
    }

    if (err.status === 500) {
        return res.status(500).json({
            msg: err.msg
        })
    }
})

module.exports = router;