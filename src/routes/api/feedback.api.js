const express = require("express");
const router = express.Router();
const feedbackApi = require("../../controllers/api/feedback.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.get("/", feedbackApi.getAll);
router.get("/pagination/:id", feedbackApi.pagination);
router.get("/:id", feedbackApi.getById);
router.get("/order/:id", feedbackApi.getByOrderId);
router.post("/:id", authMiddleware.isUser, feedbackApi.create);

module.exports = router;