const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const multer = require("multer");
const path = require("path");
const { addCertificate, getUserCertificates, reorderCertificates } = require("../controllers/certController");

// configure multer to store files in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "..", "uploads"));
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, unique + ext);
  }
});
const upload = multer({ storage });

router.post("/add", auth, upload.single("image"), addCertificate);
router.get("/my", auth, getUserCertificates);
router.patch("/reorder", auth, reorderCertificates);

module.exports = router;
