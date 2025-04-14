import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  throw new Error("Please define the MONGO_URI environment variable in your .env file");
}

let isConnected: boolean = false;

export default async function dbConnect() {
  if (isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(MONGO_URI!); // ✅ Simplified for Mongoose v6+
    isConnected = !!db.connections[0].readyState;
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}
