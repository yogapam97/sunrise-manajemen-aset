import dotenv from "dotenv";
import mongoose from "mongoose";

import mongoConnect from "../utils/mongoConnect"; // Import your mongoConnect function

dotenv.config({ path: ".env.test" });

// Run before any test case starts
beforeAll(async () => {
  await mongoConnect(); // This will connect to MongoDB
});

// Run after all test cases finish
afterAll(async () => {
  await mongoose.connection.close(); // This will close the connection
});
