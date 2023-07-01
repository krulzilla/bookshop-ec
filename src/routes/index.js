const express = require("express");
const router = express.Router();
const {uiRender: render} = require("../utils/customResponse");

// Import routes
const clientRoutes = require("./client");
const apiRoutes = require("./api");
const testRoutes = require("./test.route");

// Manage routes
router.use("/", clientRoutes);
router.use("/api/", apiRoutes);

// Test routes
router.use("/test/", testRoutes);

// Handle err & page not found
router.use((req, res, next) => {
    next({
        status: 404,
        msg: "Not found"
    })
})

router.use((err, req, res, next) => {
    if (err.status === 404) {
        return render(res, "pages-404", [], false);
    }
    console.log(err);
    if (err.status === 500) {
        return render(res, "pages-500", [], false);
    }
})

module.exports = router;