const express = require("express");
const router = express.Router();
const orderApi = require("../../controllers/api/order.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.get("/", orderApi.getAll);
router.get("/pagination", authMiddleware.isAdminOrStaff, orderApi.pagination);
router.get("/by-user/:idUser", authMiddleware.isUser, orderApi.getByUser);
router.get("/get-details/:id", authMiddleware.isUser, orderApi.getDetailsById);
router.get("/:id", authMiddleware.isUser, orderApi.getById);
router.post("/", authMiddleware.isClient, orderApi.create);
router.post("/cancel/:id", authMiddleware.isClient, orderApi.cancelOrder);
router.put("/update-status/:id",authMiddleware.isAdminOrStaff, orderApi.updateStatus);
// router.put("/:id", orderApi.update);
router.delete("/:id", authMiddleware.isAdmin, orderApi.delete);

module.exports = router;