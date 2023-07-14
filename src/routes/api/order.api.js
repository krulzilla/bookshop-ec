const express = require("express");
const router = express.Router();
const orderApi = require("../../controllers/api/order.controller");

router.get("/", orderApi.getAll);
router.get("/:id", orderApi.getById);
router.post("/", orderApi.create);
router.put("/:id", orderApi.update);
router.delete("/:id", orderApi.delete);

module.exports = router;