const cron = require('node-cron');
const { fetchTrendingTopics } = require('../services/topicService');
const { generateBlogsFromTopics } = require('../services/blogGeneratorService');

let isRunning = false;

/**
 * The main cron job function — fetches topics and generates blog posts.
 */
async function runBlogGenerationJob() {
  if (isRunning) {
    console.log('⏳ Cron job already running, skipping this cycle');
    return;
  }

  isRunning = true;
  console.log(`\n🔄 [CRON] Starting blog generation job at ${new Date().toISOString()}`);

  try {
    const topics = await fetchTrendingTopics();
    console.log(`📋 [CRON] Fetched ${topics.length} topics:`, topics);

    if (topics.length === 0) {
      console.log('⚠️ [CRON] No topics found, skipping generation');
      return;
    }

    // Only generate 2 blogs per cron run to avoid excessive API usage
    const topicsToGenerate = topics.slice(0, 2);
    const results = await generateBlogsFromTopics(topicsToGenerate);

    const successful = results.filter((r) => r.success).length;
    console.log(`✅ [CRON] Job complete. Generated ${successful}/${topicsToGenerate.length} blogs`);
  } catch (err) {
    console.error('❌ [CRON] Job failed:', err.message);
  } finally {
    isRunning = false;
  }
}

/**
 * Initialize and start the cron scheduler.
 * Runs every 4 hours: "0 (star)/4 * * *"
 */
function startCronJob() {
  console.log('⏰ Blog generation cron job scheduled (every 4 hours)');

  // Schedule: every 4 hours
  cron.schedule('0 */4 * * *', runBlogGenerationJob, {
    scheduled: true,
    timezone: 'UTC',
  });

  // Optionally run once on startup to seed content
  const runOnStartup = process.env.RUN_CRON_ON_STARTUP === 'true';
  if (runOnStartup) {
    console.log('🚀 Running initial blog generation on startup...');
    setTimeout(runBlogGenerationJob, 5000); // wait 5s for DB to connect
  }
}

module.exports = { startCronJob, runBlogGenerationJob };
