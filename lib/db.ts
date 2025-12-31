import { error } from "console";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI as string

if(!MONGO_URI){
    throw new Error("MongoURI not found");
}
let isConnected = false;

export async function connectDB() {
  if (isConnected) return;

  try {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}