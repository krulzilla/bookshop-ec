const router = require("express").Router();
const cartController = require("../../controllers/api/cart.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.get("/", cartController.getAll);
router.get("/:id", cartController.getByUser);
router.post("/", cartController.createOrModify);
router.put("/:id", authMiddleware.isClient, cartController.update);
router.delete("/:id", authMiddleware.isClient, cartController.delete);

module.exports = router;