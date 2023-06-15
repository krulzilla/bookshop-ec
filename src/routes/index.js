const express = require("express");
const router = express.Router();

// Import routes
const apiRoutes = require("./api");

// Manage routes
router.use("/api/", apiRoutes);

// Handle err & page not found
router.use((req, res, next) => {
    next({
        status: 404,
        msg: "Not found"
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