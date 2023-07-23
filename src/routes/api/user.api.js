const router = require("express").Router();
const userApi = require("../../controllers/api/user.controller");
const authMiddleware = require("../../middlewares/auth.middlware");

router.get("/pagination-customer", authMiddleware.isAdmin, userApi.paginationCustomer);
router.get("/pagination-staff", authMiddleware.isAdmin, userApi.paginationStaff);
router.get("/:id", authMiddleware.isAdmin, userApi.getById);
router.post("/create-customer", authMiddleware.isAdmin, userApi.createCustomer);
router.post("/create-staff", authMiddleware.isAdmin, userApi.createStaff);
router.post("/check-shipping-info", authMiddleware.isClient, userApi.haveShippingInfo);
router.put("/update-info", authMiddleware.isUser, userApi.updateInfo);
router.put("/update-info-staff", authMiddleware.isAdmin, userApi.updateInfoStaff);
router.put("/change-password", authMiddleware.isUser, userApi.changePassword);
router.put("/change-status/:id", authMiddleware.isAdmin, userApi.changeStatusUser);
router.delete("/:id", authMiddleware.isAdmin, userApi.delete);

module.exports = router;