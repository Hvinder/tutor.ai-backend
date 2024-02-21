import mongoose from "mongoose";

const connectDB = async () => {
  const db = process.env.MONGO_URL;
  try {
    if (!db) {
      throw new Error("No db detected!");
    }
    await mongoose.connect(db);
    console.log("MongoDB is Connected...");
  } catch (err: any) {
    console.error("db error", err?.message);
    process.exit(1);
  }
};

export default connectDB;
