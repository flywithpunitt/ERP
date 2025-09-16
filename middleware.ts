import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export const config = {
	matcher: ["/admin/:path*", "/driver/:path*", "/api/pods/:path*"],
};

export function middleware() {
	return;
}
