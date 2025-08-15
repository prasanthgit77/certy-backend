const Certificate = require("../models/Certificate");

exports.addCertificate = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, description } = req.body;
    let imagePath = "";
    if (req.file) {
      // multer stores file in /uploads; store path starting with '/'
      imagePath = "/uploads/" + req.file.filename;
    }

    // by default set order to timestamp so newest appear first by default
    const cert = new Certificate({
      user: userId,
      title,
      description,
      image: imagePath,
      order: Date.now()
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
    const certificates = await Certificate.find({ user: userId }).sort({ order: -1, createdAt: -1 }).lean();
    // prefix image URLs
    const host = req.protocol + "://" + req.get("host");
    const certs = certificates.map(c => ({ ...c, image: c.image ? host + c.image : null }));
    res.json(certs);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// reorder: accept array of certificate IDs in desired order (first = top)
exports.reorderCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const { orderedIds } = req.body; // e.g. ["id1","id2",...]
    if (!Array.isArray(orderedIds)) return res.status(400).json({ msg: "orderedIds must be an array" });

    // update order field to reflect position (higher = earlier). We'll use timestamp like Date.now() decreasing
    let orderValue = Date.now();
    const updates = orderedIds.map(id => {
      const update = Certificate.updateOne({ _id: id, user: userId }, { $set: { order: orderValue } });
      orderValue -= 1; // decrement to keep ordering
      return update;
    });
    await Promise.all(updates);
    res.json({ msg: "Order updated" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
