const router = require("express").Router();
const clientAuth = require("../../controllers/auth/client.auth");
const adminAuth = require("../../controllers/auth/admin.auth");

// Client auth
router.post("/client/register", clientAuth.isNotClient, clientAuth.register);
router.post("/client/login", clientAuth.isNotClient, clientAuth.login);
router.get("/google", clientAuth.isNotClient, clientAuth.googleAuth);
router.get("/google/callback", clientAuth.isNotClient, clientAuth.googleAuthCallback);
router.get("/github", clientAuth.isNotClient, clientAuth.githubAuth);
router.get("/github/callback", clientAuth.isNotClient, clientAuth.githubAuthCallback);

// Admin auth
router.post("/admin/login", adminAuth.isNotAdmin, adminAuth.login);

// Test routes after authenticated
router.get("/client/protect", clientAuth.isClient, (req, res) => {
    if (req.isAuthenticated()) {
        console.log("was authenticated");
    }

    console.log(req.user);

    return res.json({msg: "Test protected route!"});
})

module.exports = router;