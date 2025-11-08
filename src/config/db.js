import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config()

export const createConnection = () =>
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log(`connected to db`);
    })
    .catch((error) => console.log("Error connecting to MongoDB:", error));

createConnection();