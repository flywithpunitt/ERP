import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { POD } from "@/models/POD";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/auth";

export async function PATCH(
	request: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
) {
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

		// Get params
		const { id } = await params;

		// Parse request body
		const body = await request.json();
		const { status, remarks } = body as { status: "approved" | "rejected"; remarks?: string };

		if (!status || !["approved", "rejected"].includes(status)) {
			return NextResponse.json({ error: "Invalid status" }, { status: 400 });
		}

		// Update POD
		const pod = await POD.findByIdAndUpdate(
			id,
			{ 
				status, 
				remarks: remarks || "",
				updatedAt: new Date()
			},
			{ new: true }
		);

		if (!pod) {
			return NextResponse.json({ error: "POD not found" }, { status: 404 });
		}

		return NextResponse.json({ 
			message: "POD updated successfully",
			pod: {
				id: pod._id,
				url: pod.cloudinaryUrl,
				status: pod.status,
				remarks: pod.remarks,
				updatedAt: pod.updatedAt,
			}
		}, { status: 200 });

	} catch (error) {
		console.error("Update POD error:", error);
		return NextResponse.json({ error: "Failed to update POD" }, { status: 500 });
	}
}
