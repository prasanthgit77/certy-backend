const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const { updateProfile, getMe, getPublicProfile, togglePublicProfile } = require("../controllers/profileController");

router.get("/me", auth, getMe);
router.post("/me", auth, updateProfile);

// toggle profile public/private
//router.patch("/me/public", auth, togglePublicProfile);

// public profile (no auth needed if public)
router.get("/public/:username", getPublicProfile);

module.exports = router;
