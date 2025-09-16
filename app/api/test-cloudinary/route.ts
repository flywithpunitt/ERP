import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/cloudinary";

export async function GET() {
	try {
		// Test Cloudinary configuration
		const result = await cloudinary.api.ping();
		return NextResponse.json({ 
			success: true, 
			message: "Cloudinary connection successful",
			config: {
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY ? "***" : "missing",
				api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "missing"
			}
		});
	} catch (error) {
		console.error("Cloudinary test error:", error);
		return NextResponse.json({ 
			success: false, 
			error: error instanceof Error ? error.message : "Unknown error",
			config: {
				cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
				api_key: process.env.CLOUDINARY_API_KEY ? "***" : "missing",
				api_secret: process.env.CLOUDINARY_API_SECRET ? "***" : "missing"
			}
		}, { status: 500 });
	}
}
