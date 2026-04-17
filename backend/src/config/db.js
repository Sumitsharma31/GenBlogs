const mongoose = require('mongoose');
const dns = require('dns');

const connectDB = async () => {
  try {
    // MongoDB Atlas SRV connection strings (`mongodb+srv://...`) require DNS SRV lookups.
    // Some Windows/network DNS setups refuse SRV queries; forcing known resolvers avoids that.
    if (
      typeof process.env.MONGODB_URI === 'string' &&
      process.env.MONGODB_URI.startsWith('mongodb+srv://')
    ) {
      const servers =
        process.env.DNS_SERVERS?.split(',').map(s => s.trim()).filter(Boolean) ??
        ['1.1.1.1', '8.8.8.8'];
      if (servers.length) dns.setServers(servers);
      if (typeof dns.setDefaultResultOrder === 'function') dns.setDefaultResultOrder('ipv4first');
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 20000,
      connectTimeoutMS: 20000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
