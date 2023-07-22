const express = require("express");
const router = express.Router();
const warehouseApi = require("../../controllers/api/warehouse.controller");

router.post("/import", warehouseApi.importWarehouse);

module.exports = router;