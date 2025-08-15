const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// serve uploaded files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// profile routes (get/update profile, public profile)
app.use("/api/profile", require("./routes/profileRoutes"));

// certificate routes
app.use("/api/cert", require("./routes/certRoutes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
