const express = require("express");
const router = express.Router();
const productApi = require("../../controllers/api/product.controller");

router.get("/", productApi.getAll);
router.get("/pagination", productApi.pagination);
router.get("/:id", productApi.getById);
router.post("/", productApi.create);
router.put("/:id", productApi.update);
router.delete("/:id", productApi.delete);

module.exports = router;