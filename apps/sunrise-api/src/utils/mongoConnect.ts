import "dotenv/config";
import mongoose from "mongoose";

let globMongoose: any;

const { MONGODB_URI } = process.env;
if (!MONGODB_URI) throw new Error("MONGODB_URI not defined");

let cached = globMongoose;

if (!cached) {
  globMongoose = { conn: null, promise: null };
  cached = globMongoose;
}

async function mongoConnect() {
  // Use existing database connection
  if (cached.conn && cached.conn.readyState === 1) {
    return cached.conn;
  }

  // Use new database connection
  if (!cached.promise) {
    cached.promise = mongoose
      .connect(`${MONGODB_URI}`)
      .then((thisMongoose) => thisMongoose)
      .catch((err) => {
        // If we fail to connect, remove it from cache
        cached.conn = null;
        cached.promise = null;
        console.log(`There is something wrong with the database: ${err.message}`);
      });
  }

  // Store the successful connection & Promise in cache
  cached.conn = await cached.promise;

  return cached.conn;
}

export default mongoConnect;
