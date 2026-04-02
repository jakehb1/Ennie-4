const { Router } = require("express");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth } = require("../middleware/auth");
const { CONDITIONS } = require("../config/constants");

const router = Router();

// POST /healers/onboard
router.post("/onboard", auth, (req, res) => {
  try {
    const { languages, modality, timezone, experience } = req.body;
    if (!languages || !modality) {
      return res.status(400).json({ error: "languages and modality are required" });
    }

    const healer = {
      userId: req.user.id,
      languages: languages || [],
      modality: modality || "",
      timezone: timezone || "UTC",
      experience: experience || 0,
      specializations: [],
      earnings: { total: 0, pending: 0, paid: 0 },
      verified: false,
      availableHours: [],
      isOnline: false,
      createdAt: new Date().toISOString(),
    };

    store.setHealer(req.user.id, healer);

    // Update user
    const user = store.getUser(req.user.id);
    if (user) {
      user.onboarded = true;
      user.healerProfile = healer;
      store.setUser(user.id, user);
    }

    res.status(201).json({ healer });
  } catch (err) {
    res.status(500).json({ error: "Failed to onboard healer", detail: err.message });
  }
});

// GET /healers/profile
router.get("/profile", auth, (req, res) => {
  try {
    const healer = store.getHealer(req.user.id);
    if (!healer) return res.status(404).json({ error: "Healer profile not found" });
    res.json({ healer });
  } catch (err) {
    res.status(500).json({ error: "Failed to get profile", detail: err.message });
  }
});

// PATCH /healers/availability
router.patch("/availability", auth, (req, res) => {
  try {
    const healer = store.getHealer(req.user.id);
    if (!healer) return res.status(404).json({ error: "Healer profile not found" });

    if (req.body.availableHours !== undefined) healer.availableHours = req.body.availableHours;
    if (req.body.isOnline !== undefined) healer.isOnline = req.body.isOnline;

    store.setHealer(req.user.id, healer);
    res.json({ healer });
  } catch (err) {
    res.status(500).json({ error: "Failed to update availability", detail: err.message });
  }
});

// GET /healers/specializations
router.get("/specializations", auth, (req, res) => {
  try {
    const specs = CONDITIONS.map((c) => {
      const sessions = store
        .getAllSessions()
        .filter((s) => s.condition === c && s.status === "completed");
      const totalImprovement = sessions.reduce(
        (sum, s) => sum + (s.improvement || 0),
        0
      );
      return {
        condition: c,
        totalSessions: sessions.length,
        avgImprovement: sessions.length > 0 ? Math.round(totalImprovement / sessions.length) : 0,
        successRate: sessions.length > 0
          ? Math.round((sessions.filter((s) => (s.improvement || 0) > 0).length / sessions.length) * 100)
          : 0,
      };
    });
    res.json({ specializations: specs });
  } catch (err) {
    res.status(500).json({ error: "Failed to get specializations", detail: err.message });
  }
});

// POST /healers/claim
router.post("/claim", auth, (req, res) => {
  try {
    const healer = store.getHealer(req.user.id);
    if (!healer) return res.status(403).json({ error: "Not a registered healer" });

    const next = store.getNextInQueue();
    if (!next) return res.status(404).json({ error: "No patients in queue" });

    // Find the pending session for this patient
    const sessions = store.getSessionsByUser(next.userId);
    const pendingSession = sessions.find((s) => s.status === "pending");

    if (pendingSession) {
      pendingSession.healerId = req.user.id;
      pendingSession.status = "active";
      store.setSession(pendingSession.id, pendingSession);
    }

    store.removeFromQueue(next.userId);

    res.json({
      claimed: true,
      patient: { userId: next.userId, tier: next.tier, condition: next.condition },
      sessionId: pendingSession ? pendingSession.id : null,
      claimWindow: 5,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to claim patient", detail: err.message });
  }
});

// GET /healers/earnings
router.get("/earnings", auth, (req, res) => {
  try {
    const healer = store.getHealer(req.user.id);
    if (!healer) return res.status(404).json({ error: "Healer profile not found" });

    const completedSessions = store
      .getAllSessions()
      .filter((s) => s.healerId === req.user.id && s.status === "completed");

    res.json({
      earnings: healer.earnings,
      sessionsCompleted: completedSessions.length,
      avgImprovement: completedSessions.length > 0
        ? Math.round(
            completedSessions.reduce((sum, s) => sum + (s.improvement || 0), 0) /
              completedSessions.length
          )
        : 0,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get earnings", detail: err.message });
  }
});

module.exports = router;
