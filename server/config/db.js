import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vlox_ai'
    );
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    if (process.env.SEED_DEMO_DATA === 'true') {
      const { seedDatabase } = await import('./seed.js');
      await seedDatabase();
    }
    return true;
  } catch (error) {
    console.error(`[MongoDB Error] Database connection failed: ${error.message}`);
    return false;
  }
};
