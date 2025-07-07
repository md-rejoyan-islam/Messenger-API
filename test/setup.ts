import mongoose from "mongoose";
import { beforeAll, afterAll } from "vitest";

beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URI || "");
});

afterAll(async () => {
  await mongoose.connection.close();
});