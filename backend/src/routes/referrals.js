const { Router } = require("express");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth } = require("../middleware/auth");

const router = Router();

// POST /referrals/generate
router.post("/generate", auth, (req, res) => {
  try {
    const user = store.getUser(req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const code = `ENNIE-${uuid().slice(0, 8).toUpperCase()}`;
    const type = user.role === "healer" ? "healer" : "patient";
    const rewardAmount = type === "healer" ? 500 : 25;

    const referral = {
      ownerId: req.user.id,
      type,
      code,
      rewardAmount,
      uses: 0,
      earnings: 0,
      createdAt: new Date().toISOString(),
    };

    store.setReferral(code, referral);
    res.status(201).json({ referral });
  } catch (err) {
    res.status(500).json({ error: "Failed to generate referral", detail: err.message });
  }
});

// POST /referrals/redeem
router.post("/redeem", auth, (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "code is required" });

    const referral = store.getReferral(code);
    if (!referral) return res.status(404).json({ error: "Referral code not found" });

    if (referral.ownerId === req.user.id) {
      return res.status(400).json({ error: "Cannot redeem your own referral code" });
    }

    referral.uses += 1;
    referral.earnings += referral.rewardAmount;
    store.setReferral(code, referral);

    res.json({
      redeemed: true,
      code,
      reward: referral.rewardAmount,
      totalUses: referral.uses,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to redeem referral", detail: err.message });
  }
});

// GET /referrals/stats
router.get("/stats", auth, (req, res) => {
  try {
    const referrals = store.getReferralsByOwner(req.user.id);
    const totalUses = referrals.reduce((sum, r) => sum + r.uses, 0);
    const totalEarnings = referrals.reduce((sum, r) => sum + r.earnings, 0);

    res.json({
      totalCodes: referrals.length,
      totalUses,
      totalEarnings,
      codes: referrals.map((r) => ({
        code: r.code,
        type: r.type,
        uses: r.uses,
        earnings: r.earnings,
        createdAt: r.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get referral stats", detail: err.message });
  }
});

module.exports = router;
