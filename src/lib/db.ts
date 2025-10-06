import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

declare global {
  // allow global `_mongoose` caching across hot reloads in dev
  var _mongoose: {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
  } | undefined;
}

const cached = global._mongoose ?? (global._mongoose = { conn: null, promise: null });

export async function connectDB(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(async (m) => {
      // ✅ preload all models with dynamic imports
      await Promise.all([
        import("@/models/Customer"),
        import("@/models/Space"),
        import("@/models/Event"),
        import("@/models/Package"),
        import("@/models/Gallery"),
        import("@/models/Booking"),
        import("@/models/Service"),
      ]);

      console.log("📦 Models registered");
      return m;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
