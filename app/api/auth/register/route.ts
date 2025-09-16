import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { name, email, password, inviteCode } = body as { name: string; email: string; password: string; inviteCode?: string };

		if (!name || !email || !password) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		await connectToDatabase();

		const existing = await User.findOne({ email });
		if (existing) {
			return NextResponse.json({ error: "Email already in use" }, { status: 409 });
		}

		const passwordHash = await bcrypt.hash(password, 10);
		const role: "driver" | "admin" = inviteCode && inviteCode === process.env.ADMIN_INVITE_CODE ? "admin" : "driver";

		const user = await User.create({ name, email: email.toLowerCase(), passwordHash, role });

		return NextResponse.json(
			{ user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role } },
			{ status: 201 }
		);
	} catch (err) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
