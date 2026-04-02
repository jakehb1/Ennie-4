const { Router } = require("express");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth, JWT_SECRET } = require("../middleware/auth");
const { JWT_EXPIRES } = require("../config/constants");

const router = Router();

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
}

function sanitizeUser(user) {
  const { passwordHash, ...safe } = user;
  return safe;
}

function calcAge(dob) {
  const birth = new Date(dob);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

// POST /auth/signup
router.post(
  "/signup",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn(["case", "healer"]),
    body("dob").isISO8601(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password, role, dob } = req.body;

      if (store.getUserByEmail(email)) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const age = calcAge(dob);
      if (age < 13) {
        return res.status(400).json({ error: "Must be at least 13 years old" });
      }

      const id = uuid();
      const passwordHash = await bcrypt.hash(password, 10);
      const user = {
        id,
        email,
        passwordHash,
        role,
        dob,
        age,
        onboarded: false,
        healerProfile: null,
        createdAt: new Date().toISOString(),
      };
      store.setUser(id, user);

      const token = signToken(user);
      res.status(201).json({ token, user: sanitizeUser(user) });
    } catch (err) {
      res.status(500).json({ error: "Signup failed", detail: err.message });
    }
  }
);

// POST /auth/login
router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").notEmpty()],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const user = store.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const token = signToken(user);
      res.json({ token, user: sanitizeUser(user) });
    } catch (err) {
      res.status(500).json({ error: "Login failed", detail: err.message });
    }
  }
);

// GET /auth/me
router.get("/me", auth, (req, res) => {
  try {
    const user = store.getUser(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: sanitizeUser(user) });
  } catch (err) {
    res.status(500).json({ error: "Failed to get user", detail: err.message });
  }
});

// POST /auth/age-check
router.post("/age-check", (req, res) => {
  try {
    const { dob } = req.body;
    if (!dob) return res.status(400).json({ error: "dob is required" });
    const age = calcAge(dob);
    res.json({ eligible: age >= 13, age });
  } catch (err) {
    res.status(500).json({ error: "Age check failed", detail: err.message });
  }
});

module.exports = router;
