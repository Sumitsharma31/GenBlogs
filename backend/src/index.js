require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');
const newsletterRoutes = require('./routes/newsletter');
const { startCronJob } = require('./jobs/cronJob');

const app = express();
const PORT = process.env.BACKEND_PORT || 8080; // Defaults to 8080 for internal proxying via Next.js
console.log('DEBUG: process.env.PORT =', process.env.PORT);
console.log('DEBUG: ADMIN_SECRET =', process.env.ADMIN_SECRET ? 'Defined' : 'Undefined');

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors()); // Allow everything
app.use(express.json({ limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[Backend] ${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`);
  next();
});

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Blog Platform API',
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/blogs', blogRoutes);
app.use('/auth', authRoutes);
app.use('/newsletter', newsletterRoutes);

// Alias: POST /generate → POST /blogs/generate
app.post('/generate', (req, res, next) => {
  req.url = '/generate';
  blogRoutes(req, res, next);
});

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
async function start() {
  try {
    console.log('📡 Attempting to connect to database...');
    await connectDB();
    
    console.log(`🔑 Gemini Key loaded: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 7) + '...' : 'MISSING'}`);
    
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`\n🚀 AI Blog Platform API running on http://0.0.0.0:${PORT}`);
      console.log(`📚 Health Check: http://localhost:${PORT}/health\n`);
    });

    // Start the cron scheduler
    startCronJob();
  } catch (err) {
    console.error('CRITICAL: Failed to start server components:');
    console.error(err);
    // On Render, we might want to stay alive briefly to let logs flush
    setTimeout(() => process.exit(1), 2000);
  }
}

start();
