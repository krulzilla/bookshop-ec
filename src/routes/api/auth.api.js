const router = require("express").Router();
const passport = require("passport");
const clientAuth = require("../../controllers/auth/client.auth");

router.post("/client/register", clientAuth.register);
router.post("/client/login", clientAuth.login);
router.get("/google", clientAuth.googleAuth);
router.get("/google/callback", clientAuth.googleAuthCallback);
router.get("/github", clientAuth.githubAuth);
router.get("/github/callback", clientAuth.githubAuthCallback);

router.use(clientAuth.isUser);

router.get("/client/protect", (req, res) => {
    if (req.isAuthenticated()) {
        console.log("was authenticated");
    }

    console.log(req.user);

    return res.json({msg: "Test protected route!"});
})

module.exports = router;