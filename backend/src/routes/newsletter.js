const express = require('express');
const router = express.Router();
const Subscriber = require('../models/Subscriber');

const isValidEmail = (email) => {
  if (!email) return false;
  // Practical validation (not fully RFC, but good UX)
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(String(email).trim());
};

// POST /newsletter/subscribe
router.post('/subscribe', async (req, res) => {
  try {
    const { email } = req.body;
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address.' });
    }

    const normalized = String(email).trim().toLowerCase();
    const existing = await Subscriber.findOne({ email: normalized });
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed.' });
    }

    await Subscriber.create({ email: normalized });
    return res.status(201).json({ success: true, message: 'Subscribed successfully.' });
  } catch (err) {
    // Handle duplicate key race
    if (err && (err.code === 11000 || err.code === 11001)) {
      return res.json({ success: true, message: 'You are already subscribed.' });
    }
    console.error('POST /newsletter/subscribe error:', err);
    return res.status(500).json({ success: false, message: 'Failed to subscribe. Please try again.' });
  }
});

module.exports = router;

