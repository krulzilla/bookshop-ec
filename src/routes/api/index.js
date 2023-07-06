const express = require("express");
const router = express.Router();

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

// Manage api routes
router.use("/auth", authApi);

router.use("/category", categoryApi);
router.use("/author", authorApi);
router.use("/publisher", publisherApi);
router.use("/product", productApi);
router.use("/role", roleApi);
router.use("/user", userApi);
router.use("/cart", cartApi);
router.use("/typeTransport", typeTransportApi);
router.use("/typePayment", typePaymentApi);
router.use("/payment", paymentApi);

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