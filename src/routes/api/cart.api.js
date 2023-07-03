const router = require("express").Router();
const cartController = require("../../controllers/api/cart.controller");

router.get("/", cartController.getAll);
router.get("/:id", cartController.getByUser);
router.post("/", cartController.createOrModify);
router.put("/:id", cartController.update);
router.delete("/:id", cartController.delete);

module.exports = router;