const { Router } = require("express");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth } = require("../middleware/auth");
const { GROUP_PRICE_SINGLE } = require("../config/constants");

const router = Router();

// GET /groups - list upcoming group sessions
router.get("/", (req, res) => {
  try {
    const groups = store.getGroupSessions().filter(
      (g) => g.status === "scheduled" || g.status === "active"
    );
    res.json({ groups });
  } catch (err) {
    res.status(500).json({ error: "Failed to list groups", detail: err.message });
  }
});

// GET /groups/:id
router.get("/:id", (req, res) => {
  try {
    const group = store.getGroupSession(req.params.id);
    if (!group) return res.status(404).json({ error: "Group session not found" });
    res.json({ group });
  } catch (err) {
    res.status(500).json({ error: "Failed to get group", detail: err.message });
  }
});

// POST /groups/:id/join
router.post("/:id/join", auth, (req, res) => {
  try {
    const group = store.getGroupSession(req.params.id);
    if (!group) return res.status(404).json({ error: "Group session not found" });

    if (group.participants.length >= group.maxParticipants) {
      return res.status(409).json({ error: "Group session is full" });
    }

    if (group.participants.includes(req.user.id)) {
      return res.status(409).json({ error: "Already joined this session" });
    }

    group.participants.push(req.user.id);
    res.json({
      group,
      price: GROUP_PRICE_SINGLE,
      spotsRemaining: group.maxParticipants - group.participants.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to join group", detail: err.message });
  }
});

// POST /groups - create group session (admin)
router.post("/", auth, (req, res) => {
  try {
    const { title, focus, scheduledAt, maxParticipants, healerId } = req.body;
    if (!title || !scheduledAt) {
      return res.status(400).json({ error: "title and scheduledAt are required" });
    }

    const group = store.addGroupSession({
      id: uuid(),
      title,
      focus: focus || "",
      scheduledAt,
      maxParticipants: maxParticipants || 20,
      participants: [],
      healerId: healerId || req.user.id,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ group });
  } catch (err) {
    res.status(500).json({ error: "Failed to create group", detail: err.message });
  }
});

module.exports = router;
