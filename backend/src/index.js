require("dotenv").config();

const path = require("path");
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
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://unpkg.com"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"],
      },
    },
  })
);
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

// Serve static frontend
app.use(express.static(path.join(__dirname, "..", "public")));

// API health check
app.get("/api/health", (req, res) => {
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

// SPA fallback — serve index.html for non-API routes
app.use((req, res) => {
  if (req.path.startsWith("/auth") || req.path.startsWith("/sessions") ||
      req.path.startsWith("/queue") || req.path.startsWith("/healers") ||
      req.path.startsWith("/groups") || req.path.startsWith("/payments") ||
      req.path.startsWith("/referrals") || req.path.startsWith("/admin") ||
      req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Not found" });
  }
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
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
