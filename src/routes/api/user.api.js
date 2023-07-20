const router = require("express").Router();
const userApi = require("../../controllers/api/user.controller");

router.get("/pagination-customer", userApi.paginationCustomer);
router.get("/pagination-staff", userApi.paginationStaff);
router.get("/:id", userApi.getById);
router.post("/create-customer", userApi.createCustomer);
router.post("/create-staff", userApi.createStaff);
router.post("/check-shipping-info", userApi.haveShippingInfo);
router.put("/update-info", userApi.updateInfo);
router.put("/update-info-staff", userApi.updateInfoStaff);
router.put("/change-password", userApi.changePassword);
router.put("/change-status/:id", userApi.changeStatusUser);
router.delete("/:id", userApi.delete);

module.exports = router;