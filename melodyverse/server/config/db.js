const mongoose = require('mongoose');

const DEFAULT_LOCAL_URI = 'mongodb://127.0.0.1:27017/melodyverse';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI?.trim() || DEFAULT_LOCAL_URI;

  try {
    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Error connecting to ${uri}: ${error.message}`);

    if (uri !== DEFAULT_LOCAL_URI) {
      try {
        console.warn('⚠️ Falling back to local MongoDB URI:', DEFAULT_LOCAL_URI);
        const fallbackConn = await mongoose.connect(DEFAULT_LOCAL_URI, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected to local fallback: ${fallbackConn.connection.host}`);
        return fallbackConn;
      } catch (fallbackError) {
        console.error(`❌ Local MongoDB fallback failed: ${fallbackError.message}`);
      }
    }

    throw error;
  }
};

module.exports = connectDB;
