const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Blog = require('../models/Blog');
const { generateBlogFromTopic } = require('../services/blogGeneratorService');

const requireAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  let token = '';

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else {
    // Fallback for older frontend client if still sending x-admin-secret but it's a jwt
    token = req.headers['x-admin-secret'] || req.query.adminSecret;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || process.env.ADMIN_SECRET;
    const decoded = jwt.verify(token, jwtSecret);
    
    if (decoded.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired admin token' });
  }
};

// GET /blogs — list all published blogs (or all for admin)
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 9, tag, q, admin } = req.query;
    let isAdmin = false;
    
    if (admin === 'true') {
      const authHeader = req.headers['authorization'];
      let token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : req.headers['x-admin-secret'] || req.query.adminSecret;
      
      if (token) {
        try {
          const jwtSecret = process.env.JWT_SECRET || process.env.ADMIN_SECRET;
          const decoded = jwt.verify(token, jwtSecret);
          if (decoded.role === 'admin') isAdmin = true;
        } catch (e) {
          // invalid token, treat as non-admin
        }
      }
    }

    const filter = isAdmin ? {} : { status: 'published' };
    if (tag) filter.tags = { $in: [tag] };
    if (q && String(q).trim()) {
      const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const needle = escapeRegExp(String(q).trim());
      const rx = new RegExp(needle, 'i');
      filter.$or = [
        { title: rx },
        { excerpt: rx },
        { topic: rx },
        { tags: { $elemMatch: { $regex: rx } } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Blog.countDocuments(filter);
    const blogs = await Blog.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-content'); // Exclude full content from list

    res.json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('GET /blogs error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /blogs/:slug — single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    console.error('GET /blogs/:slug error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /blogs/generate — manually trigger blog generation
router.post('/generate', requireAdmin, async (req, res) => {
  try {
    const { topic } = req.body;
    if (!topic) {
      return res.status(400).json({ success: false, message: 'Topic is required' });
    }

    const blog = await generateBlogFromTopic(topic);
    res.status(201).json({ success: true, message: 'Blog generated successfully', data: blog });
  } catch (err) {
    console.error('POST /blogs/generate error:', err);
    res.status(500).json({ success: false, message: err.message || 'Generation failed' });
  }
});

// PATCH /blogs/:id — update blog status or fields
router.patch('/:id', requireAdmin, async (req, res) => {
  try {
    const allowedUpdates = ['status', 'title', 'metaTitle', 'metaDescription', 'tags'];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const blog = await Blog.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, data: blog });
  } catch (err) {
    console.error('PATCH /blogs/:id error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /blogs/:id — delete a blog
router.delete('/:id', requireAdmin, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (err) {
    console.error('DELETE /blogs/:id error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
