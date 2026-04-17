require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const blogRoutes = require('./routes/blogs');
const authRoutes = require('./routes/auth');
const newsletterRoutes = require('./routes/newsletter');
const { startCronJob } = require('./jobs/cronJob');

const app = express();
const PORT = process.env.PORT || 8080;
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
  await connectDB();
  console.log(`🔑 Gemini Key loaded: ${process.env.GEMINI_API_KEY ? process.env.GEMINI_API_KEY.substring(0, 7) + '...' : 'MISSING'}`);
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 AI Blog Platform API running on http://0.0.0.0:${PORT}`);
    console.log(`📡 Network access: http://192.168.0.15:${PORT}`);
    console.log(`📚 Endpoints:`);
    console.log(`   GET    http://localhost:${PORT}/blogs`);
    console.log(`   GET    http://localhost:${PORT}/blogs/:slug`);
    console.log(`   POST   http://localhost:${PORT}/blogs/generate`);
    console.log(`   PATCH  http://localhost:${PORT}/blogs/:id`);
    console.log(`   DELETE http://localhost:${PORT}/blogs/:id`);
    console.log(`   GET    http://localhost:${PORT}/health\n`);
  });

  // Start the cron scheduler
  startCronJob();
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
