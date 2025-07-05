import mongoose from "mongoose";
import secret from "../app/secret";

const connectDB = async (): Promise<void> => {
  try {
    const connect = await mongoose.connect(secret.mongoURI);
    console.log(`MongoDB connected: ${connect.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error connecting to MongoDB: ${error.message}`);
    } else {
      console.error("An unknown error occurred while connecting to MongoDB.");
    }
    process.exit(1);
  }
};

export default connectDB;
