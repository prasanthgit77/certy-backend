const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, lowercase: true },
  fullname: { type: String, default: "" },
  bio: { type: String, default: "" },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isPublic: { type: Boolean, default: false } // NEW — public profile toggle
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
