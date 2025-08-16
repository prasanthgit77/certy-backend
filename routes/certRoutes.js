const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const { addCertificate, getUserCertificates, reorderCertificates } = require("../controllers/certController");

// use multer memoryStorage so file buffer goes directly to Cloudinary
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/add", auth, upload.single("image"), addCertificate);
router.get("/my", auth, getUserCertificates);
router.patch("/reorder", auth, reorderCertificates);

module.exports = router;
