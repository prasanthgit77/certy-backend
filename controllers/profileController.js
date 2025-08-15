const User = require("../models/User");
const Certificate = require("../models/Certificate");

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { fullname, bio } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { fullname, bio },
      { new: true }
    ).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Public profile by username — **no JWT checks**
exports.getPublicProfile = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).select("-password -email");

    if (!user) return res.status(404).json({ msg: "User not found" });

    // fetch certificates in order
    const certificates = await Certificate.find({ user: user._id })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    const host = req.protocol + "://" + req.get("host");
    const certs = certificates.map(c => ({
      ...c,
      image: c.image ? `${host}${c.image}` : null
    }));

    res.json({ user, certificates: certs });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};
