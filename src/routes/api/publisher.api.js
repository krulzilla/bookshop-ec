const express = require("express");
const router = express.Router();
const publisherApi = require("../../controllers/api/publisher.controller");

router.get("/", publisherApi.getAll);
router.get("/:id", publisherApi.getById);
router.post("/", publisherApi.create);
router.put("/:id", publisherApi.update);
router.delete("/:id", publisherApi.delete);

module.exports = router;