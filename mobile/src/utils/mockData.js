/**
 * Mock data for development and demo purposes
 */

export const MOCK_SESSIONS = [
  {
    id: '1',
    date: '2024-03-15',
    condition: 'Chronic Back Pain',
    healer: 'Healer #4217',
    tier: 'verified',
    beforeSeverity: 7,
    afterSeverity: 3,
    improvement: 57,
    duration: 1800,
    followUp: { severity: 4, hoursAfter: 24 },
  },
  {
    id: '2',
    date: '2024-03-10',
    condition: 'Migraine',
    healer: 'Healer #1893',
    tier: 'free',
    beforeSeverity: 8,
    afterSeverity: 5,
    improvement: 38,
    duration: 1800,
    followUp: null,
  },
  {
    id: '3',
    date: '2024-03-05',
    condition: 'Anxiety',
    healer: 'Healer #7722',
    tier: 'verified',
    beforeSeverity: 6,
    afterSeverity: 2,
    improvement: 67,
    duration: 1800,
    followUp: { severity: 3, hoursAfter: 24 },
  },
];

export const MOCK_GROUP_SESSIONS = [
  {
    id: 'g1',
    title: 'Chronic Pain Relief',
    focus: 'pain',
    healer: 'Charlie Goldsmith',
    scheduledAt: new Date(Date.now() + 2 * 3600000).toISOString(),
    participants: 18,
    maxParticipants: 30,
    priceSingle: 29,
    priceMonthly: 19.99,
  },
  {
    id: 'g2',
    title: 'Stress & Anxiety Release',
    focus: 'stress',
    healer: 'Healer #4217',
    scheduledAt: new Date(Date.now() + 26 * 3600000).toISOString(),
    participants: 24,
    maxParticipants: 30,
    priceSingle: 29,
    priceMonthly: 19.99,
  },
  {
    id: 'g3',
    title: 'Emotional Healing Circle',
    focus: 'emotional',
    healer: 'Healer #1893',
    scheduledAt: new Date(Date.now() + 50 * 3600000).toISOString(),
    participants: 12,
    maxParticipants: 30,
    priceSingle: 29,
    priceMonthly: 19.99,
  },
  {
    id: 'g4',
    title: 'Migraine Management',
    focus: 'pain',
    healer: 'Healer #7722',
    scheduledAt: new Date(Date.now() + 74 * 3600000).toISOString(),
    participants: 8,
    maxParticipants: 30,
    priceSingle: 29,
    priceMonthly: 19.99,
  },
];

export const MOCK_HEALER_SPECIALIZATIONS = [
  { condition: 'Chronic Pain', icon: '🔧', successRate: 82, sessions: 156, verified: true },
  { condition: 'Migraine', icon: '🧠', successRate: 78, sessions: 94, verified: true },
  { condition: 'Arthritis', icon: '🦴', successRate: 68, sessions: 43, verified: false },
  { condition: 'Anxiety', icon: '🌀', successRate: 54, sessions: 27, verified: false },
];

export const MOCK_EARNINGS = {
  thisWeek: 1250,
  thisMonth: 4800,
  allTime: 32400,
  sessions: { individual: 89, group: 24 },
  rate: { individual: 45, group: 30 },
  referrals: 2,
  referralEarnings: 1000,
  transactions: [
    { id: 't1', date: '2024-03-15', type: 'Session', amount: 45, status: 'Paid' },
    { id: 't2', date: '2024-03-14', type: 'Group Session', amount: 30, status: 'Paid' },
    { id: 't3', date: '2024-03-13', type: 'Session', amount: 45, status: 'Paid' },
    { id: 't4', date: '2024-03-12', type: 'Referral Bonus', amount: 500, status: 'Paid' },
    { id: 't5', date: '2024-03-11', type: 'Session', amount: 45, status: 'Pending' },
  ],
};

export const MOCK_ADMIN_STATS = {
  queueLength: 47,
  activeSessions: 12,
  healersOnline: 8,
  systemWindow: 15,
  sessionsToday: 34,
  avgImprovement: 52,
  revenueToday: 4250,
  patientsInQueue: 47,
  committedHealers: 8,
  queueEntries: [
    { id: 'q1', position: 1, tier: 'today', condition: 'Migraine', waitMin: 3 },
    { id: 'q2', position: 2, tier: 'today', condition: 'Chronic Pain', waitMin: 5 },
    { id: 'q3', position: 3, tier: 'week', condition: 'Arthritis', waitMin: 18 },
    { id: 'q4', position: 4, tier: 'week', condition: 'Anxiety', waitMin: 22 },
    { id: 'q5', position: 5, tier: 'free', condition: 'Back Pain', waitMin: 35 },
    { id: 'q6', position: 6, tier: 'line', condition: 'Fibromyalgia', waitMin: 48 },
    { id: 'q7', position: 7, tier: 'free', condition: 'Neuropathy', waitMin: 52 },
  ],
};
