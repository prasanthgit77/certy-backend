const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// ====================
// CORS setup
// ====================
const allowedOrigins = [
  "http://localhost:3000",                 
  "https://certy-frontend-rho.vercel.app" // Vercel frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // allow Postman/curl
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
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ====================
// Routes
// ====================
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/cert", require("./routes/certRoutes"));

// ====================
// Start server
// ====================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
