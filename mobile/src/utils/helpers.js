/**
 * Queue wait time computation (mirrors backend logic)
 */
export const computeWait = (tier, patients = 3, committed = 4) => {
  const base = Math.max(2, Math.round((patients / Math.max(committed, 1)) * 5));
  if (tier === 'free') return Math.min(base * 2, 60);
  if (tier === 'today') return Math.min(base, 90);
  if (tier === 'week') return Math.min(base * 3, 7 * 24 * 60);
  return base;
};

export const fmtWait = (m) => {
  if (m < 2) return 'under 2 min';
  if (m < 60) return `~${m} min`;
  if (m < 24 * 60) return `~${Math.round(m / 60)} hr`;
  return `~${Math.round(m / (24 * 60))} days`;
};

export const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

/**
 * Format duration in seconds to MM:SS
 */
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

/**
 * Calculate improvement percentage between baseline and final pins
 */
export const calcImprovement = (baselinePins, finalPins) => {
  if (!baselinePins?.length || !finalPins?.length) return 0;
  const baseTotal = baselinePins.reduce((sum, p) => sum + (p.severity || 0), 0);
  const finalTotal = finalPins.reduce((sum, p) => sum + (p.severity || 0), 0);
  if (baseTotal === 0) return 0;
  return Math.round(((baseTotal - finalTotal) / baseTotal) * 100);
};

/**
 * Generate a unique ID
 */
export const generateId = () =>
  `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

/**
 * Severity color based on value
 */
export const severityColor = (value) => {
  if (value > 6) return '#A32D2D'; // danger
  if (value > 3) return '#E07830'; // warm
  return '#8B3FFF'; // accent
};

/**
 * Condition data for the app
 */
export const CONDITIONS = [
  { id: 'arthritis', label: 'Arthritis', icon: '🦴', avgDrop: '5.5 pts', pct: 82 },
  { id: 'migraine', label: 'Migraine & Headaches', icon: '🧠', avgDrop: '5.2 pts', pct: 79 },
  { id: 'chronic_back', label: 'Back & Joint Pain', icon: '💪', avgDrop: '4.5 pts', pct: 72 },
  { id: 'fibromyalgia', label: 'Fibromyalgia', icon: '💢', avgDrop: '3.1 pts', pct: 52 },
  { id: 'neuropathy', label: 'Neuropathy', icon: '⚡', avgDrop: '2.6 pts', pct: 46 },
  { id: 'anxiety', label: 'Stress & Anxiety', icon: '🌀', avgDrop: '5.6 pts', pct: 81 },
  { id: 'emotional_trauma', label: 'Emotional / Trauma', icon: '💜', avgDrop: '5.0 pts', pct: 76 },
  { id: 'chronic_pain', label: 'Chronic Pain', icon: '🔧', avgDrop: '4.8 pts', pct: 74 },
];

/**
 * Tier data
 */
export const TIERS = {
  free: { price: 0, label: 'Free Session', desc: 'Test healer — unverified', wait: '~15 min' },
  line: { price: 50, label: 'Get in Line', desc: 'Verified healer', wait: '~2 hrs' },
  week: { price: 150, label: 'This Week', desc: 'Verified healer — priority', wait: '~30 min' },
  today: { price: 350, label: 'Today', desc: 'Verified healer — immediate', wait: '~5 min' },
};

/**
 * Activity messages for live ticker
 */
export const ACTIVITY_MESSAGES = [
  '3 patients just completed sessions in the last hour',
  'A healer in Melbourne achieved 92% improvement on chronic pain',
  '12 new patients joined this week',
  'Group healing session starting in 45 minutes — 230 registered',
  'Average session improvement today: 47% reduction',
  "A patient's migraine dropped from 8 to 2 in 11 minutes",
  '5 healers are currently available for sessions',
  'Follow-up data: 68% of patients held improvements at 24hrs',
];
