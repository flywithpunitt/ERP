import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
	throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

interface GlobalWithMongooseCache {
	mongooseCache?: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

const globalWithCache = global as typeof global & GlobalWithMongooseCache;

if (!globalWithCache.mongooseCache) {
	globalWithCache.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
	const cache = globalWithCache.mongooseCache!;
	if (cache.conn) {
		return cache.conn;
	}
	if (!cache.promise) {
		cache.promise = mongoose.connect(MONGODB_URI, { dbName: "erp" });
	}
	cache.conn = await cache.promise;
	return cache.conn;
}
