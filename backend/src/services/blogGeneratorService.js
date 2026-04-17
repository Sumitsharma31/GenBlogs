const slugify = require('slugify');
const Blog = require('../models/Blog');
const { generateBlogContent } = require('./geminiService');
const { fetchUnsplashImage } = require('./unsplashService');

/**
 * Generate a unique URL slug for a blog title.
 */
async function generateUniqueSlug(title) {
  const baseSlug = slugify(title, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });

  let slug = baseSlug;
  let counter = 1;

  while (await Blog.findOne({ slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}

/**
 * Calculate approximate reading time in minutes.
 */
function calculateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Full blog generation pipeline:
 * 1. Call Gemini for structured content
 * 2. Fetch image from Unsplash
 * 3. Generate unique slug
 * 4. Save to MongoDB
 */
async function generateBlogFromTopic(topic) {
  console.log(`🧠 Generating blog for topic: "${topic}"`);

  // Step 1: Generate AI content
  const aiContent = await generateBlogContent(topic);

  // Step 2: Fetch image (use first tag or topic as image query)
  const imageQuery = (aiContent.tags && aiContent.tags[0]) || topic;
  const image = await fetchUnsplashImage(imageQuery);

  // Step 3: Generate unique slug
  const slug = await generateUniqueSlug(aiContent.title);

  // Step 4: Calculate reading time
  const readingTime = calculateReadingTime(aiContent.content);

  // Step 5: Save to DB
  const blog = new Blog({
    title: aiContent.title,
    slug,
    content: aiContent.content,
    excerpt: aiContent.excerpt,
    image,
    tags: aiContent.tags || [],
    metaTitle: aiContent.metaTitle,
    metaDescription: aiContent.metaDescription,
    status: 'draft', // Always starts as draft for review
    topic,
    readingTime,
  });

  await blog.save();
  console.log(`✅ Blog saved: "${blog.title}" (slug: ${slug})`);
  return blog;
}

/**
 * Generate multiple blogs from an array of topics.
 * Adds a delay between generations to avoid rate limiting.
 */
async function generateBlogsFromTopics(topics) {
  const results = [];
  for (const topic of topics) {
    try {
      const blog = await generateBlogFromTopic(topic);
      results.push({ topic, success: true, slug: blog.slug });
      // Wait 3 seconds between API calls
      await new Promise((resolve) => setTimeout(resolve, 3000));
    } catch (err) {
      console.error(`❌ Failed to generate blog for "${topic}":`, err.message);
      results.push({ topic, success: false, error: err.message });
    }
  }
  return results;
}

module.exports = { generateBlogFromTopic, generateBlogsFromTopics };
