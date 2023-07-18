const express = require("express");
const router = express.Router();
const categoryApi = require("../../controllers/api/category.controller");

router.get("/", categoryApi.getAll);
router.get("/pagination", categoryApi.pagination);
router.get("/:id", categoryApi.getById);
router.post("/", categoryApi.create);
router.put("/:id", categoryApi.update);
router.delete("/:id", categoryApi.delete);

module.exports = router;