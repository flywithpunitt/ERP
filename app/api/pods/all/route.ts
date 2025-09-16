import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { POD } from "@/models/POD";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
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

		// Check if user is admin
		await connectToDatabase();
		const user = await User.findById(payload.userId);
		if (!user || user.role !== "admin") {
			return NextResponse.json({ error: "Access denied" }, { status: 403 });
		}

		// Get all PODs with driver info
		const pods = await POD.find()
			.populate("userId", "name email")
			.sort({ createdAt: -1 })
			.select("cloudinaryUrl status remarks createdAt updatedAt userId");

		return NextResponse.json({ 
			pods: pods.map(pod => ({
				id: pod._id,
				url: pod.cloudinaryUrl,
				status: pod.status,
				remarks: pod.remarks,
				createdAt: pod.createdAt,
				updatedAt: pod.updatedAt,
				driver: {
					id: (pod.userId as any)._id,
					name: (pod.userId as any).name,
					email: (pod.userId as any).email,
				}
			}))
		}, { status: 200 });

	} catch (error) {
		console.error("Get all PODs error:", error);
		return NextResponse.json({ error: "Failed to fetch PODs" }, { status: 500 });
	}
}
