const express = require("express");
const router = express.Router();
const roleApi = require("../../controllers/api/role.controller");

router.get("/", roleApi.getAll);
router.get("/:id", roleApi.getById);
router.post("/", roleApi.create);
router.put("/:id", roleApi.update);
router.delete("/:id", roleApi.delete);

module.exports = router;