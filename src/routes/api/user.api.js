const router = require("express").Router();
const userApi = require("../../controllers/api/user.controller");

router.put("/update-info", userApi.updateInfo);

module.exports = router;