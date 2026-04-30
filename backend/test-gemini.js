require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function test() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('GEMINI_API_KEY not found in .env');
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const models = ['gemini-2.0-flash', 'gemini-2.0-flash-exp', 'gemini-1.5-flash'];

  for (const modelName of models) {
    try {
      console.log(`Testing model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent('Say "Hello"');
      console.log(`✅ Success with ${modelName}: ${result.response.text()}`);
      return;
    } catch (err) {
      console.error(`❌ Failed with ${modelName}: ${err.message}`);
    }
  }
}

test();
