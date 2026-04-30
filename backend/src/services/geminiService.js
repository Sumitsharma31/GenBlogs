const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Generate a full structured blog post from a given topic.
 * @param {string} topic - The topic to write about
 * @returns {Object} - { title, content, excerpt, tags, metaTitle, metaDescription, readingTime }
 */
async function generateBlogContent(topic) {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('Gemini API key is missing or not configured in .env');
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `You are an expert blog writer. Write a comprehensive, SEO-optimized, human-like blog post about: "${topic}".

IMPORTANT FORMATTING RULES:
- Use Markdown formatting
- The post must have the following exact sections (use these H2 headers):
  ## Introduction
  ## [2-3 topic-specific H2 sections with H3 subsections]
  ## Key Insights & Takeaways
  ## Frequently Asked Questions
  ## Conclusion

REQUIREMENTS:
- Write in a friendly, authoritative, and helpful tone
- Minimum 1000 words of actual content
- Include 3-5 specific FAQ questions and answers in the FAQ section (use **Q:** and **A:** format)
- Include actionable insights and real examples
- Do NOT use placeholder text or generic filler
- Do NOT repeat the same sentence or idea multiple times

RESPONSE FORMAT (respond ONLY in this JSON structure, no extra text):
{
  "title": "Compelling SEO title (60 chars max)",
  "excerpt": "2-3 sentence engaging summary of the post (150 chars max)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "metaTitle": "SEO meta title (55-60 chars)",
  "metaDescription": "Compelling meta description (150-160 chars)",
  "readingTime": 7,
  "content": "Full Markdown blog content here"
}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response (handle potential markdown code blocks)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Gemini did not return valid JSON');
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    const required = ['title', 'content', 'excerpt', 'tags', 'metaTitle', 'metaDescription'];
    for (const field of required) {
      if (!parsed[field]) {
        throw new Error(`Missing field in Gemini response: ${field}`);
      }
    }

    return parsed;
  } catch (err) {
    console.error('Gemini generation error:', err.message);
    let errorMsg = err.message;
    if (err.message.includes('404')) {
      errorMsg = 'Model not found (404). Please check if your Gemini API key has access to gemini-1.5-flash.';
    } else if (err.message.includes('401') || err.message.includes('403')) {
      errorMsg = 'Invalid API key or permission denied. Please check your GEMINI_API_KEY.';
    }
    throw new Error(`Content generation failed: ${errorMsg}`);
  }
}

module.exports = { generateBlogContent };
