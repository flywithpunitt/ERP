import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function GET(request: Request) {
	const authHeader = request.headers.get("authorization") || request.headers.get("Authorization");
	const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
	if (!token) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}
	const payload = verifyToken(token);
	if (!payload) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	await connectToDatabase();
	const user = await User.findById(payload.userId).select("name email role");
	if (!user) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	return NextResponse.json({ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } }, { status: 200 });
}
