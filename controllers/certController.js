const Certificate = require("../models/Certificate");
const cloudinary = require("../config/cloudinary"); // import cloudinary config

exports.addCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    let imageUrl = "";

    if (req.file) {
      // upload file buffer to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "certificates" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file.buffer);
      });
      imageUrl = result.secure_url; // Cloudinary URL
    }

    const cert = new Certificate({
      user: userId,
      title,
      description,
      image: imageUrl,
      order: Date.now(),
    });

    await cert.save();
    res.json(cert);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getUserCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificates = await Certificate.find({ user: userId })
      .sort({ order: -1, createdAt: -1 })
      .lean();

    // Cloudinary already provides full URL
    res.json(certificates);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Reorder certificates
exports.reorderCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds))
      return res.status(400).json({ msg: "orderedIds must be an array" });

    let orderValue = Date.now();
    const updates = orderedIds.map((id) => {
      const update = Certificate.updateOne(
        { _id: id, user: userId },
        { $set: { order: orderValue } }
      );
      orderValue -= 1;
      return update;
    });

    await Promise.all(updates);
    res.json({ msg: "Order updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
