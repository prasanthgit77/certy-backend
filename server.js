const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ====================
// CORS setup
// ====================
const allowedOrigins = [
  "http://localhost:3000", // local frontend
  "https://certy-frontend.vercel.app" // replace with your actual Vercel frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like curl, mobile apps)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// parse JSON requests
app.use(express.json());

// serve uploaded files (images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================
// Routes
// ====================
// auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// profile routes (get/update profile, public profile)
app.use("/api/profile", require("./routes/profileRoutes"));

// certificate routes
app.use("/api/cert", require("./routes/certRoutes"));

// ====================
// Start server
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
