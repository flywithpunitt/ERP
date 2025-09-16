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

		// Check if user is driver
		await connectToDatabase();
		const user = await User.findById(payload.userId);
		if (!user || user.role !== "driver") {
			return NextResponse.json({ error: "Access denied" }, { status: 403 });
		}

		// Get driver's PODs
		const pods = await POD.find({ userId: user._id })
			.sort({ createdAt: -1 })
			.select("cloudinaryUrl status remarks createdAt updatedAt");

		return NextResponse.json({ 
			pods: pods.map(pod => ({
				id: pod._id,
				url: pod.cloudinaryUrl,
				status: pod.status,
				remarks: pod.remarks,
				createdAt: pod.createdAt,
				updatedAt: pod.updatedAt,
			}))
		}, { status: 200 });

	} catch (error) {
		console.error("Get PODs error:", error);
		return NextResponse.json({ error: "Failed to fetch PODs" }, { status: 500 });
	}
}
