const { Router } = require("express");
const store = require("../models/store");
const { auth, adminOnly } = require("../middleware/auth");

const router = Router();

// All admin routes require auth + admin role
router.use(auth);
router.use(adminOnly);

// GET /admin/dashboard
router.get("/dashboard", (req, res) => {
  try {
    const allSessions = store.getAllSessions();
    const queue = store.getQueue();
    const onlineHealers = store.getOnlineHealers();
    const allHealers = store.getAllHealers();
    const allUsers = store.getAllUsers();

    res.json({
      stats: {
        totalUsers: allUsers.length,
        totalSessions: allSessions.length,
        activeSessions: allSessions.filter((s) => s.status === "active").length,
        completedSessions: allSessions.filter((s) => s.status === "completed").length,
        queueLength: queue.length,
        healersOnline: onlineHealers.length,
        totalHealers: allHealers.length,
        avgImprovement: (() => {
          const completed = allSessions.filter((s) => s.status === "completed" && s.improvement != null);
          if (completed.length === 0) return 0;
          return Math.round(completed.reduce((sum, s) => sum + s.improvement, 0) / completed.length);
        })(),
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get dashboard", detail: err.message });
  }
});

// GET /admin/queue
router.get("/queue", (req, res) => {
  try {
    const queue = store.getQueue();
    res.json({
      queue: queue.map((entry) => ({
        ...entry,
        user: (() => {
          const u = store.getUser(entry.userId);
          return u ? { id: u.id, email: u.email, role: u.role } : null;
        })(),
      })),
      total: queue.length,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get queue", detail: err.message });
  }
});

// GET /admin/healers
router.get("/healers", (req, res) => {
  try {
    const healers = store.getAllHealers();
    const healerStats = healers.map((h) => {
      const sessions = store.getAllSessions().filter(
        (s) => s.healerId === h.userId && s.status === "completed"
      );
      return {
        ...h,
        sessionsCompleted: sessions.length,
        avgImprovement: sessions.length > 0
          ? Math.round(sessions.reduce((sum, s) => sum + (s.improvement || 0), 0) / sessions.length)
          : 0,
      };
    });
    res.json({ healers: healerStats, total: healerStats.length });
  } catch (err) {
    res.status(500).json({ error: "Failed to get healers", detail: err.message });
  }
});

module.exports = router;
