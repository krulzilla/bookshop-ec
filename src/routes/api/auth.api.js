const router = require("express").Router();
const passport = require("passport");
const clientAuth = require("../../controllers/auth/client.auth");

router.post("/client/register", clientAuth.register);
router.post("/client/login", clientAuth.login);

router.use(clientAuth.isUser);

router.get("/client/protect", (req, res) => {
    return res.json({msg: "Test protected route!"});
})

module.exports = router;