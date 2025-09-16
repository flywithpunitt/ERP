import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { POD } from "@/models/POD";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
	try {
		// Verify authentication
		const authHeader = request.headers.get("authorization");
		const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
		if (!token) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		const payload = verifyToken(token);
		if (!payload) {
			return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
		}

		// Check if user is driver
		await connectToDatabase();
		const user = await User.findById(payload.userId);
		if (!user || user.role !== "driver") {
			return NextResponse.json({ error: "Access denied" }, { status: 403 });
		}

		// Parse form data
		const formData = await request.formData();
		const file = formData.get("file") as File;
		if (!file) {
			return NextResponse.json({ error: "No file provided" }, { status: 400 });
		}

		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Upload to Cloudinary - simple approach
		let result;
		try {
			result = await cloudinary.uploader.upload(
				`data:${file.type};base64,${buffer.toString('base64')}`,
				{
					resource_type: "auto",
					folder: "erp-pods",
				}
			);
		} catch (cloudinaryError) {
			console.error("Cloudinary upload error:", cloudinaryError);
			return NextResponse.json({ 
				error: "File upload failed. Please check Cloudinary configuration.",
				details: cloudinaryError instanceof Error ? cloudinaryError.message : "Unknown error"
			}, { status: 500 });
		}

		// Save to database
		const pod = await POD.create({
			userId: user._id,
			cloudinaryUrl: result.secure_url,
			status: "pending",
		});

		return NextResponse.json({ 
			message: "POD uploaded successfully", 
			pod: {
				id: pod._id,
				url: pod.cloudinaryUrl,
				status: pod.status,
				createdAt: pod.createdAt,
			}
		}, { status: 201 });

	} catch (error) {
		console.error("Upload error:", error);
		return NextResponse.json({ error: "Upload failed" }, { status: 500 });
	}
}
