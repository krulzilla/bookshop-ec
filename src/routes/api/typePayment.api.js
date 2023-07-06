const router = require("express").Router();
const typePaymentApi = require("../../controllers/api/typePayment.controller");

router.get("/", typePaymentApi.getAll);
router.get("/:id", typePaymentApi.getById);
router.post("/", typePaymentApi.create);
router.put("/:id", typePaymentApi.update);
router.delete("/:id", typePaymentApi.delete);

module.exports = router;