module.exports = {
  TIERS: {
    free: { price: 0, label: "Free (Test Healer)" },
    today: { price: 350, label: "Today", waitDesc: "~5 min" },
    week: { price: 150, label: "This Week", waitDesc: "~30 min" },
    line: { price: 50, label: "Get in Line", waitDesc: "~2 hrs" },
  },
  CONDITIONS: [
    "arthritis",
    "migraine",
    "chronic_back",
    "fibromyalgia",
    "neuropathy",
    "anxiety",
    "emotional_trauma",
    "chronic_pain",
  ],
  SESSION_DURATION: 1800,
  GROUP_PRICE_SINGLE: 29,
  GROUP_PRICE_MONTHLY: 19.99,
  JWT_EXPIRES: "7d",
};
