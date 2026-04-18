const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /auth/login
// Verifies the admin secret and returns a JWT token
router.post('/login', (req, res) => {
  try {
    const { secret } = req.body;
    
    if (!secret) {
      return res.status(400).json({ success: false, message: 'Secret is required' });
    }

    if (secret === process.env.ADMIN_SECRET) {
      // Generate a JWT token valid for 24 hours
      const jwtSecret = process.env.JWT_SECRET || process.env.ADMIN_SECRET;
      const token = jwt.sign({ role: 'admin' }, jwtSecret, { expiresIn: '24h' });

      return res.json({ 
        success: true, 
        message: 'Authenticated successfully',
        token
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
