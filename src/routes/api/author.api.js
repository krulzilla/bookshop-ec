const express = require("express");
const router = express.Router();
const authorApi = require("../../controllers/api/author.controller");

router.get("/", authorApi.getAll);
router.get("/:id", authorApi.getById);
router.post("/", authorApi.create);
router.put("/:id", authorApi.update);
router.delete("/:id", authorApi.delete);

module.exports = router;