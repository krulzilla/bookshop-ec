const express = require("express");
const router = express.Router();
const warehouseApi = require("../../controllers/api/warehouse.controller");

router.get("/get-details/:id", warehouseApi.getDetailById);
router.get("/pagination", warehouseApi.pagination);
router.post("/import", warehouseApi.importWarehouse);
router.delete("/:id", warehouseApi.delete);

module.exports = router;