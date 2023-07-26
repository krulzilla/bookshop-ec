const express = require("express");
const router = express.Router();
const wishlistApi = require("../../controllers/api/wishlist.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.get("/", authMiddleware.isUser, wishlistApi.getAll);
router.get("/user", authMiddleware.isClient, wishlistApi.getByUser);
router.get("/:id", authMiddleware.isClient, wishlistApi.getById);
router.post("/", authMiddleware.isClient, wishlistApi.create);
router.delete("/:id", authMiddleware.isClient, wishlistApi.delete);

module.exports = router;