// test/setup.ts
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const connectTestDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
    });
    console.log("Test MongoDB connected");
  } catch (error: any) {
    console.error("Test MongoDB connection error:", error.message);
  }
};

const disconnectTestDB = async () => {
  try {
    await mongoose.connection.close();
    console.log("Test MongoDB disconnected");
  } catch (error: any) {
    console.error("Test MongoDB disconnection error:", error.message);
  }
};

beforeAll(async () => {
  await connectTestDB();
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});
afterAll(disconnectTestDB);
