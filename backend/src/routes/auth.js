const express = require('express');
const router = express.Router();

// POST /auth/login
// Verifies the admin secret and returns success
router.post('/login', (req, res) => {
  try {
    const { secret } = req.body;
    
    if (!secret) {
      return res.status(400).json({ success: false, message: 'Secret is required' });
    }

    if (secret === process.env.ADMIN_SECRET) {
      return res.json({ 
        success: true, 
        message: 'Authenticated successfully',
        // In a real app, we might return a JWT here. 
        // For this simple implementation, we just confirm it's correct.
      });
    } else {
      return res.status(401).json({ success: false, message: 'Invalid admin secret' });
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

module.exports = router;
