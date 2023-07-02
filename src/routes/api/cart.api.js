const router = require("express").Router();
const cartController = require("../../controllers/api/cart.controller");

router.get("/", cartController.getAll);
router.get("/:id", cartController.getAll);
router.post("/", cartController.createOrModify);
router.delete("/:id", cartController.delete);

module.exports = router;