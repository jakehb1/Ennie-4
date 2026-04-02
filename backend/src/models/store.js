const users = new Map();
const sessions = new Map();
const queue = [];
const healers = new Map();
const groupSessions = [];
const referrals = new Map();
const payments = [];

module.exports = {
  // Users
  getUser: (id) => users.get(id),
  getUserByEmail: (email) => [...users.values()].find((u) => u.email === email),
  setUser: (id, user) => users.set(id, user),
  getAllUsers: () => [...users.values()],

  // Sessions
  getSession: (id) => sessions.get(id),
  setSession: (id, session) => sessions.set(id, session),
  getSessionsByUser: (userId) =>
    [...sessions.values()].filter(
      (s) => s.patientId === userId || s.healerId === userId
    ),
  getAllSessions: () => [...sessions.values()],

  // Queue
  getQueue: () => queue,
  addToQueue: (entry) => {
    entry.position = queue.length + 1;
    queue.push(entry);
    return entry;
  },
  removeFromQueue: (userId) => {
    const idx = queue.findIndex((q) => q.userId === userId);
    if (idx !== -1) {
      queue.splice(idx, 1);
      queue.forEach((q, i) => (q.position = i + 1));
      return true;
    }
    return false;
  },
  getQueueEntry: (userId) => queue.find((q) => q.userId === userId),
  getNextInQueue: (tier) => {
    if (tier) return queue.find((q) => q.tier === tier);
    return queue[0] || null;
  },

  // Healers
  getHealer: (userId) => healers.get(userId),
  setHealer: (userId, healer) => healers.set(userId, healer),
  getAllHealers: () => [...healers.values()],
  getOnlineHealers: () => [...healers.values()].filter((h) => h.isOnline),

  // Group sessions
  getGroupSessions: () => groupSessions,
  getGroupSession: (id) => groupSessions.find((g) => g.id === id),
  addGroupSession: (session) => {
    groupSessions.push(session);
    return session;
  },

  // Referrals
  getReferral: (code) => referrals.get(code),
  setReferral: (code, ref) => referrals.set(code, ref),
  getReferralsByOwner: (ownerId) =>
    [...referrals.values()].filter((r) => r.ownerId === ownerId),

  // Payments
  getPayments: () => payments,
  addPayment: (payment) => {
    payments.push(payment);
    return payment;
  },
  getPaymentsByUser: (userId) => payments.filter((p) => p.userId === userId),
  getPayment: (id) => payments.find((p) => p.id === id),
};
