const router = require("express").Router();
const userApi = require("../../controllers/api/user.controller");

router.put("/update-info", userApi.updateInfo);
router.post("/check-shipping-info", userApi.haveShippingInfo);

module.exports = router;