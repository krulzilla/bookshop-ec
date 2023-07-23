const router = require("express").Router();
const clientAuth = require("../../controllers/auth/client.auth");
const adminAuth = require("../../controllers/auth/admin.auth");
const staffAuth = require("../../controllers/auth/staff.auth");

// Client auth
router.post("/client/register", clientAuth.isNotClient, clientAuth.register);
router.post("/client/login", clientAuth.isNotClient, clientAuth.login);
router.get("/google", clientAuth.isNotClient, clientAuth.googleAuth);
router.get("/google/callback", clientAuth.isNotClient, clientAuth.googleAuthCallback);
router.get("/github", clientAuth.isNotClient, clientAuth.githubAuth);
router.get("/github/callback", clientAuth.isNotClient, clientAuth.githubAuthCallback);

// Admin auth
router.post("/admin/login", adminAuth.isNotAdmin, adminAuth.login);

// Staff auth
router.post("/staff/login", staffAuth.isNotStaff, staffAuth.login);

module.exports = router;