import mongoose from "mongoose";

export const createConnection = () => {
  if (!process.env.MONGO_URL) {
    console.warn('⚠️ MONGO_URL not set, skipping database connection');
    return Promise.resolve();
  }

  return mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`✅ Connected to MongoDB`);
    })
    .catch((error) => console.log("❌ Error connecting to MongoDB:", error));
}

// Only auto-connect in production
if (process.env.NODE_ENV === 'production') {
  createConnection();
}