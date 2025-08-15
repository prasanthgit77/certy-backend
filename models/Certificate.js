const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  image: { type: String, default: "" }, // path like /uploads/filename.jpg
  order: { type: Number, default: Date.now }, // used for ordering
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Certificate", certificateSchema);
