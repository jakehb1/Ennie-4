const { Router } = require("express");
const { v4: uuid } = require("uuid");
const store = require("../models/store");
const { auth } = require("../middleware/auth");
const { TIERS } = require("../config/constants");

const router = Router();

// POST /payments/create-intent
router.post("/create-intent", auth, (req, res) => {
  try {
    const { tier, sessionId } = req.body;
    if (!tier || !TIERS[tier]) {
      return res.status(400).json({ error: "Invalid tier" });
    }

    const amount = TIERS[tier].price * 100; // cents
    const paymentIntent = {
      id: `pi_${uuid().replace(/-/g, "")}`,
      clientSecret: `pi_${uuid().replace(/-/g, "")}_secret_${uuid().replace(/-/g, "").slice(0, 12)}`,
      amount,
      currency: "usd",
      status: "requires_confirmation",
      tier,
      sessionId: sessionId || null,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    };

    store.addPayment(paymentIntent);
    res.status(201).json({ paymentIntent: { clientSecret: paymentIntent.clientSecret, amount, id: paymentIntent.id } });
  } catch (err) {
    res.status(500).json({ error: "Failed to create payment intent", detail: err.message });
  }
});

// POST /payments/confirm
router.post("/confirm", auth, (req, res) => {
  try {
    const { paymentIntentId } = req.body;
    if (!paymentIntentId) {
      return res.status(400).json({ error: "paymentIntentId is required" });
    }

    const payment = store.getPayment(paymentIntentId);
    if (!payment) return res.status(404).json({ error: "Payment intent not found" });

    payment.status = "succeeded";
    payment.confirmedAt = new Date().toISOString();

    // Update session if linked
    if (payment.sessionId) {
      const session = store.getSession(payment.sessionId);
      if (session) {
        session.paid = true;
        store.setSession(session.id, session);
      }
    }

    res.json({ payment: { id: payment.id, status: payment.status, amount: payment.amount } });
  } catch (err) {
    res.status(500).json({ error: "Failed to confirm payment", detail: err.message });
  }
});

// GET /payments/history
router.get("/history", auth, (req, res) => {
  try {
    const payments = store.getPaymentsByUser(req.user.id);
    res.json({
      payments: payments.map((p) => ({
        id: p.id,
        amount: p.amount,
        currency: p.currency,
        status: p.status,
        tier: p.tier,
        sessionId: p.sessionId,
        createdAt: p.createdAt,
        confirmedAt: p.confirmedAt || null,
      })),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to get payment history", detail: err.message });
  }
});

module.exports = router;
