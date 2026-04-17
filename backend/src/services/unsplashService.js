const axios = require('axios');

/**
 * Fetch a relevant image from Unsplash based on a search query.
 * Falls back to a placeholder if the API call fails or key is missing.
 * @param {string} query - Search keyword(s)
 * @returns {Object} - { url, alt, credit }
 */
async function fetchUnsplashImage(query) {
  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  // Fallback images if no API key
  if (!accessKey || accessKey === 'your_unsplash_access_key_here') {
    return getFallbackImage(query);
  }

  try {
    const response = await axios.get('https://api.unsplash.com/search/photos', {
      params: {
        query,
        per_page: 5,
        orientation: 'landscape',
        content_filter: 'high',
      },
      headers: {
        Authorization: `Client-ID ${accessKey}`,
      },
      timeout: 8000,
    });

    const results = response.data.results;
    if (!results || results.length === 0) {
      return getFallbackImage(query);
    }

    // Pick a random result from top 5 for variety
    const photo = results[Math.floor(Math.random() * results.length)];

    return {
      url: photo.urls.regular,
      alt: photo.alt_description || query,
      credit: `Photo by ${photo.user.name} on Unsplash`,
    };
  } catch (err) {
    console.warn('Unsplash API error, using fallback:', err.message);
    return getFallbackImage(query);
  }
}

/**
 * Return a high-quality placeholder image from Unsplash's source API (no key needed).
 */
function getFallbackImage(query) {
  const encodedQuery = encodeURIComponent(query.split(' ').slice(0, 3).join(' '));
  return {
    url: `https://source.unsplash.com/1200x630/?${encodedQuery}`,
    alt: query,
    credit: 'Photo from Unsplash',
  };
}

module.exports = { fetchUnsplashImage };
