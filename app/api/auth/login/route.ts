import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/models/User";
import { signToken } from "@/lib/auth";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { email, password } = body as { email: string; password: string };

		if (!email || !password) {
			return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
		}

		await connectToDatabase();
		const user = await User.findOne({ email: email.toLowerCase() });
		if (!user) {
			return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		}

		const valid = await bcrypt.compare(password, user.passwordHash);
		if (!valid) {
			return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
		}

		const token = signToken({ userId: user._id.toString(), role: user.role });

		return NextResponse.json({
			user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
			token,
		});
	} catch (err) {
		return NextResponse.json({ error: "Server error" }, { status: 500 });
	}
}
