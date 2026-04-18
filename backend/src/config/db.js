const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // MongoDB Atlas SRV connection strings (`mongodb+srv://...`) require DNS SRV lookups.
    // Some Windows/network DNS setups refuse SRV queries; forcing known resolvers avoids that.
    // Force IPv4 for MongoDB Atlas if needed (helpful for some DNS setups)
    if (typeof dns.setDefaultResultOrder === 'function') {
      dns.setDefaultResultOrder('ipv4first');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    if (!process.env.MONGODB_URI) {
      console.error('⚠️ MONGODB_URI is not defined in environment variables!');
    }
    // Don't exit(1) immediately, let the server start so we can see logs
    // but the app won't be functional.
    throw error; 
  }
};

module.exports = connectDB;
