const { Router } = require("express");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth } = require("../middleware/auth");
const { TIERS, SESSION_DURATION } = require("../config/constants");

const router = Router();

// POST /sessions - create session
router.post("/", auth, (req, res) => {
  try {
    const { tier, baselinePins, condition } = req.body;
    if (!tier || !TIERS[tier]) {
      return res.status(400).json({ error: "Invalid tier" });
    }

    const id = uuid();
    const session = {
      id,
      patientId: req.user.id,
      healerId: null,
      tier,
      status: "pending",
      baselinePins: baselinePins || [],
      finalPins: [],
      improvement: null,
      duration: SESSION_DURATION,
      isGroup: false,
      createdAt: new Date().toISOString(),
      endedAt: null,
      condition: condition || null,
      followUp: null,
    };
    store.setSession(id, session);

    // Add to queue
    const queueEntry = store.addToQueue({
      id: uuid(),
      userId: req.user.id,
      tier,
      condition: condition || null,
      joinedAt: new Date().toISOString(),
    });

    res.status(201).json({ session, queuePosition: queueEntry.position });
  } catch (err) {
    res.status(500).json({ error: "Failed to create session", detail: err.message });
  }
});

// GET /sessions/history/me - must be before :id route
router.get("/history/me", auth, (req, res) => {
  try {
    const sessions = store.getSessionsByUser(req.user.id);
    res.json({ sessions: sessions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
  } catch (err) {
    res.status(500).json({ error: "Failed to get history", detail: err.message });
  }
});

// GET /sessions/:id
router.get("/:id", auth, (req, res) => {
  try {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to get session", detail: err.message });
  }
});

// PATCH /sessions/:id
router.patch("/:id", auth, (req, res) => {
  try {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const { finalPins, status, healerId } = req.body;
    if (finalPins) session.finalPins = finalPins;
    if (status) session.status = status;
    if (healerId) session.healerId = healerId;

    store.setSession(session.id, session);
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to update session", detail: err.message });
  }
});

// POST /sessions/:id/end
router.post("/:id/end", auth, (req, res) => {
  try {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    const { finalPins } = req.body;
    if (finalPins) session.finalPins = finalPins;

    // Calculate improvement by comparing baseline vs final severity
    let improvement = null;
    if (session.baselinePins.length > 0 && session.finalPins.length > 0) {
      const baselineTotal = session.baselinePins.reduce(
        (sum, p) => sum + (p.severity || 0),
        0
      );
      const finalTotal = session.finalPins.reduce(
        (sum, p) => sum + (p.severity || 0),
        0
      );
      if (baselineTotal > 0) {
        improvement = Math.round(
          ((baselineTotal - finalTotal) / baselineTotal) * 100
        );
      }
    }

    session.improvement = improvement;
    session.status = "completed";
    session.endedAt = new Date().toISOString();

    store.setSession(session.id, session);
    store.removeFromQueue(session.patientId);

    res.json({ session, improvement });
  } catch (err) {
    res.status(500).json({ error: "Failed to end session", detail: err.message });
  }
});

// POST /sessions/:id/follow-up
router.post("/:id/follow-up", auth, (req, res) => {
  try {
    const session = store.getSession(req.params.id);
    if (!session) return res.status(404).json({ error: "Session not found" });

    session.followUp = {
      submittedAt: new Date().toISOString(),
      painLevel: req.body.painLevel,
      sleepQuality: req.body.sleepQuality,
      mobility: req.body.mobility,
      notes: req.body.notes || "",
    };

    store.setSession(session.id, session);
    res.json({ session });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit follow-up", detail: err.message });
  }
});

module.exports = router;
