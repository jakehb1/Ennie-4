const { Router } = require("express");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth } = require("../middleware/auth");
const { TIERS } = require("../config/constants");

const router = Router();

// GET /queue/status
router.get("/status", auth, (req, res) => {
  try {
    const entry = store.getQueueEntry(req.user.id);
    if (!entry) {
      return res.json({ inQueue: false });
    }

    const tierInfo = TIERS[entry.tier] || {};
    const patientsAhead = entry.position - 1;

    res.json({
      inQueue: true,
      position: entry.position,
      tier: entry.tier,
      estimatedWait: tierInfo.waitDesc || "unknown",
      patientsAhead,
      joinedAt: entry.joinedAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get queue status", detail: err.message });
  }
});

// POST /queue/join
router.post("/join", auth, (req, res) => {
  try {
    const { tier, condition } = req.body;
    if (!tier || !TIERS[tier]) {
      return res.status(400).json({ error: "Invalid tier" });
    }

    // Check if already in queue
    if (store.getQueueEntry(req.user.id)) {
      return res.status(409).json({ error: "Already in queue" });
    }

    const entry = store.addToQueue({
      id: uuid(),
      userId: req.user.id,
      tier,
      condition: condition || null,
      joinedAt: new Date().toISOString(),
    });

    res.status(201).json({ entry });
  } catch (err) {
    res.status(500).json({ error: "Failed to join queue", detail: err.message });
  }
});

// DELETE /queue/leave
router.delete("/leave", auth, (req, res) => {
  try {
    const removed = store.removeFromQueue(req.user.id);
    if (!removed) {
      return res.status(404).json({ error: "Not in queue" });
    }
    res.json({ message: "Left queue successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to leave queue", detail: err.message });
  }
});

// GET /queue/stats
router.get("/stats", auth, (req, res) => {
  try {
    const q = store.getQueue();
    const onlineHealers = store.getOnlineHealers();
    const activeSessions = store.getAllSessions().filter((s) => s.status === "active");

    res.json({
      totalPatients: q.length,
      committedHealers: onlineHealers.length,
      activeSessions: activeSessions.length,
      systemWindow: {
        today: q.filter((e) => e.tier === "today").length,
        week: q.filter((e) => e.tier === "week").length,
        line: q.filter((e) => e.tier === "line").length,
        free: q.filter((e) => e.tier === "free").length,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get stats", detail: err.message });
  }
});

module.exports = router;
