const express = require("express");
const router = express.Router();
const {uiRender: render} = require("../utils/customResponse");

// Import routes
const clientRoutes = require("./client");
const adminRoutes = require("./admin");
const staffRoutes = require("./staff");
const apiRoutes = require("./api");

// Import middleware
const authMiddleware = new (require("../controllers/auth/base.auth"))();

// Use middleware
router.use(authMiddleware.authenticate);

// Manage routes
router.use("/", clientRoutes);
router.use("/admincp/", adminRoutes);
router.use("/staffcp/", staffRoutes);
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
        return render(res, "pages-404", [], false);
    }
    if (err.status === 500) {
        return render(res, "pages-500", [], false);
    }
})

module.exports = router;