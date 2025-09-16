import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function GET() {
	try {
		// Test MongoDB connection
		await connectToDatabase();
		
		return NextResponse.json({ 
			status: "healthy",
			timestamp: new Date().toISOString(),
			environment: {
				mongodb: process.env.MONGODB_URI ? "configured" : "missing",
				jwt: process.env.JWT_SECRET ? "configured" : "missing",
				cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing"
			}
		});
	} catch (error) {
		console.error("Health check error:", error);
		return NextResponse.json({ 
			status: "unhealthy",
			error: error instanceof Error ? error.message : "Unknown error",
			environment: {
				mongodb: process.env.MONGODB_URI ? "configured" : "missing",
				jwt: process.env.JWT_SECRET ? "configured" : "missing",
				cloudinary: process.env.CLOUDINARY_CLOUD_NAME ? "configured" : "missing"
			}
		}, { status: 500 });
	}
}
