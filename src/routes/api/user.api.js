const router = require("express").Router();
const userApi = require("../../controllers/api/user.controller");

router.put("/update-info", userApi.updateInfo);
router.put("/change-password", userApi.changePassword);
router.post("/check-shipping-info", userApi.haveShippingInfo);

module.exports = router;