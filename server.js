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
  "http://localhost:3000",                  // local frontend
  "https://certy-frontend-rho.vercel.app"  // your deployed Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (curl, Postman, mobile apps)
    if (!origin) return callback(null, true);
    if (!allowedOrigins.includes(origin)) {
      const msg = `The CORS policy for this site does not allow access from the specified Origin.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

// ====================
// Body parser
// ====================
// For JSON
app.use(express.json());
// For URL-encoded form data (for multer, if needed)
app.use(express.urlencoded({ extended: true }));

// ====================
// Serve uploaded files
// ====================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ====================
// Routes
// ====================
// Auth routes
app.use("/api/auth", require("./routes/authRoutes"));

// Profile routes
app.use("/api/profile", require("./routes/profileRoutes"));

// Certificate routes
app.use("/api/cert", require("./routes/certRoutes"));

// ====================
// Start server
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
