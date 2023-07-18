const express = require("express");
const router = express.Router();
const orderApi = require("../../controllers/api/order.controller");

router.get("/", orderApi.getAll);
router.get("/pagination", orderApi.pagination);
router.get("/by-user/:idUser", orderApi.getByUser);
router.get("/get-details/:id", orderApi.getDetailsById);
router.get("/:id", orderApi.getById);
router.post("/", orderApi.create);
router.put("/update-status/:id", orderApi.updateStatus);
router.put("/:id", orderApi.update);
router.delete("/:id", orderApi.delete);

module.exports = router;