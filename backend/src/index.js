require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const authRoutes = require("./routes/auth");
const sessionRoutes = require("./routes/sessions");
const queueRoutes = require("./routes/queue");
const healerRoutes = require("./routes/healers");
const groupRoutes = require("./routes/groups");
const paymentRoutes = require("./routes/payments");
const referralRoutes = require("./routes/referrals");
const adminRoutes = require("./routes/admin");

const app = express();

// Security & middleware
app.use(cors());
app.use(helmet());
app.use(morgan("combined"));
app.use(express.json());

// Rate limiting: 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later" },
});
app.use(limiter);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "Ennie Healing Platform API",
    version: "1.0.0",
    timestamp: new Date().toISOString(),
  });
});

// Mount routes
app.use("/auth", authRoutes);
app.use("/sessions", sessionRoutes);
app.use("/queue", queueRoutes);
app.use("/healers", healerRoutes);
app.use("/groups", groupRoutes);
app.use("/payments", paymentRoutes);
app.use("/referrals", referralRoutes);
app.use("/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

// Global error handler
app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Ennie API running on port ${PORT}`);
});

module.exports = app;
