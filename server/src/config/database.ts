import { MongoClient, Db } from "mongodb";

const MONGODB_URI = process.env.MONGODB_URI || "";

console.log("==== database confgig ===");
console.log("MONGODB_URI exists:", !!process.env.MONGODB_URI);
console.log(
  "Using URI:",
  MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, "//***:***@")
);
console.log("=====================");

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase() {
  console.log("connectToDatabase called");

  if (cachedClient && cachedDb) {
    console.log("Using cached connection");
    return { client: cachedClient, db: cachedDb };
  }

  try {
    console.log("Creating new MongoDB connection...");
    console.log("Connection URI:", MONGODB_URI);

    const client = await MongoClient.connect(MONGODB_URI, {
      connectTimeoutMS: 5000, // 5 seconds
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
    });

    console.log("MongoDB connected successfully");

    const db = client.db();

    // Test the connection
    await db.command({ ping: 1 });
    console.log("Database ping successful");

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error: any) {
    console.error("MongoDB connection FAILED:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    console.error("Error code:", error.code);
    throw error;
  }
}
