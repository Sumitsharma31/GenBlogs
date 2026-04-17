const axios = require('axios');

// Curated niche + trending topic categories as fallback
const MOCK_TOPICS = [
  'The Future of Artificial Intelligence in Healthcare',
  'How Quantum Computing Will Change Cybersecurity',
  'Sustainable Living: Practical Tips for 2025',
  'The Rise of Edge Computing in Smart Cities',
  'Mental Health in the Age of Social Media',
  'Electric Vehicles: What to Expect in the Next 5 Years',
  'Mastering Remote Work Productivity in 2025',
  'The Impact of AI on Creative Industries',
  'Blockchain Beyond Cryptocurrency: Real-World Use Cases',
  'Space Tourism: The New Frontier of Travel',
  'How Gene Editing Could Cure Genetic Diseases',
  'The Psychology of Habit Formation and Behavior Change',
  'Renewable Energy Breakthroughs Powering the Future',
  'Digital Minimalism: Reclaiming Your Attention',
  'The Ethics of Autonomous Vehicles',
];

/**
 * Fetch trending topics from NewsAPI, with a mock fallback.
 * @returns {string[]} - Array of trending topic strings
 */
async function fetchTrendingTopics() {
  const newsApiKey = process.env.NEWS_API_KEY;

  if (!newsApiKey || newsApiKey === 'your_newsapi_key_here') {
    console.log('📰 Using mock trending topics (no NEWS_API_KEY set)');
    return getMockTopics(5);
  }

  try {
    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        language: 'en',
        pageSize: 20,
        category: 'technology',
      },
      headers: {
        'X-Api-Key': newsApiKey,
      },
      timeout: 8000,
    });

    const articles = response.data.articles || [];
    const topics = articles
      .map((a) => a.title)
      .filter((title) => title && title.length > 20 && title.length < 120)
      .filter((title) => !title.includes('[Removed]'))
      .slice(0, 10);

    if (topics.length === 0) {
      return getMockTopics(5);
    }

    return filterAndPrioritizeTopics(topics);
  } catch (err) {
    console.warn('NewsAPI fetch failed, using mock topics:', err.message);
    return getMockTopics(5);
  }
}

/**
 * Filter and deduplicate topics, prioritizing niche/specific topics.
 */
function filterAndPrioritizeTopics(topics) {
  const genericKeywords = ['breaking', 'latest', 'update', 'news', 'report', 'says'];
  
  const filtered = topics.filter((topic) => {
    const lower = topic.toLowerCase();
    return !genericKeywords.some((keyword) => lower.includes(keyword));
  });

  // Deduplicate by normalized lowercase comparison
  const seen = new Set();
  const unique = filtered.filter((topic) => {
    const key = topic.toLowerCase().trim();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return unique.slice(0, 5);
}

/**
 * Get a random subset of mock topics.
 */
function getMockTopics(count) {
  const shuffled = [...MOCK_TOPICS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

module.exports = { fetchTrendingTopics };
