"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Mode = "login" | "register";

export default function AuthForm({ mode }: { mode: Mode }) {
	const router = useRouter();
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [inviteCode, setInviteCode] = useState("");
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function onSubmit(e: React.FormEvent) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		try {
			if (mode === "register") {
				const res = await fetch("/api/auth/register", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name, email, password, inviteCode: inviteCode || undefined }),
				});
				if (!res.ok) {
					const data = await res.json();
					throw new Error(data.error || "Registration failed");
				}
				router.push("/login");
			} else {
				const res = await fetch("/api/auth/login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Login failed");
				}
				localStorage.setItem("erp_token", data.token);
				const role = data.user.role as "admin" | "driver";
				if (role === "admin") router.push("/admin/dashboard");
				else router.push("/driver/dashboard");
			}
		} catch (err: any) {
			setError(err.message || "Something went wrong");
		} finally {
			setLoading(false);
		}
	}

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			{mode === "register" && (
				<div className="space-y-2">
					<label className="block text-sm font-medium text-slate-700">Full Name</label>
					<input 
						value={name} 
						onChange={(e) => setName(e.target.value)} 
						className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors" 
						placeholder="Enter your full name"
						required 
					/>
				</div>
			)}
			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-700">Email Address</label>
				<input 
					type="email" 
					value={email} 
					onChange={(e) => setEmail(e.target.value)} 
					className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors" 
					placeholder="Enter your email"
					required 
				/>
			</div>
			<div className="space-y-2">
				<label className="block text-sm font-medium text-slate-700">Password</label>
				<input 
					type="password" 
					value={password} 
					onChange={(e) => setPassword(e.target.value)} 
					className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors" 
					placeholder="Enter your password"
					required 
				/>
			</div>
			{mode === "register" && (
				<div className="space-y-2">
					<label className="block text-sm font-medium text-slate-700">Admin Invite Code (optional)</label>
					<input 
						value={inviteCode} 
						onChange={(e) => setInviteCode(e.target.value)} 
						className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors" 
						placeholder="Enter admin invite code"
					/>
					<p className="text-xs text-slate-500">Use this to create an admin account</p>
				</div>
			)}
			{error && (
				<div className="p-3 bg-red-50 border border-red-200 rounded-lg">
					<p className="text-red-600 text-sm">{error}</p>
				</div>
			)}
			<button 
				type="submit" 
				className="w-full bg-slate-900 hover:bg-black text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
				disabled={loading}
			>
				{loading ? (
					<div className="flex items-center justify-center gap-2">
						<div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
						Please wait...
					</div>
				) : (
					mode === "login" ? "Sign in" : "Create account"
				)}
			</button>
		</form>
	);
}
