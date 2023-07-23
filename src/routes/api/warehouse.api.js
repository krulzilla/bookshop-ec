const express = require("express");
const router = express.Router();
const warehouseApi = require("../../controllers/api/warehouse.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.get("/get-details/:id", authMiddleware.isAdmin, warehouseApi.getDetailById);
router.get("/pagination", authMiddleware.isAdmin, warehouseApi.pagination);
router.post("/import", authMiddleware.isAdminOrStaff, warehouseApi.importWarehouse);
router.delete("/:id", authMiddleware.isAdmin, warehouseApi.delete);

module.exports = router;