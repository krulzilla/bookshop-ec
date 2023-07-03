const router = require("express").Router();
const typeTransportApi = require("../../controllers/api/typeTransport.controller");

router.get("/", typeTransportApi.getAll);
router.get("/:id", typeTransportApi.getById);
router.post("/", typeTransportApi.create);
router.put("/:id", typeTransportApi.update);
router.delete("/:id", typeTransportApi.delete);

module.exports = router;