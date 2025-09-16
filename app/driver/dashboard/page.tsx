"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface POD {
	id: string;
	url: string;
	status: "pending" | "approved" | "rejected";
	remarks?: string;
	createdAt: string;
	updatedAt: string;
}

export default function DriverDashboard() {
	const router = useRouter();
	const [name, setName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [pods, setPods] = useState<POD[]>([]);
	const [uploading, setUploading] = useState(false);
	const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

	useEffect(() => {
		async function load() {
			const token = localStorage.getItem("erp_token");
			if (!token) {
				router.replace("/login");
				return;
			}
			const res = await fetch("/api/auth/me", { headers: { Authorization: `Bearer ${token}` } });
			if (res.status === 401) {
				localStorage.removeItem("erp_token");
				router.replace("/login");
				return;
			}
			const { user } = await res.json();
			setName(user.name);
			setLoading(false);
			loadPODs(token);
		}
		load();
	}, [router]);

	async function loadPODs(token: string) {
		try {
			const res = await fetch("/api/pods/my", { headers: { Authorization: `Bearer ${token}` } });
			if (res.ok) {
				const data = await res.json();
				setPods(data.pods);
			}
		} catch (error) {
			console.error("Failed to load PODs:", error);
		}
	}

	async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;

		const token = localStorage.getItem("erp_token");
		if (!token) return;

		setUploading(true);
		try {
			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/pods/upload", {
				method: "POST",
				headers: { Authorization: `Bearer ${token}` },
				body: formData,
			});

			if (res.ok) {
				setToast({ message: "POD uploaded successfully!", type: "success" });
				setTimeout(() => setToast(null), 3000);
				loadPODs(token);
			} else {
				const error = await res.json();
				setToast({ message: error.error || "Upload failed", type: "error" });
				setTimeout(() => setToast(null), 3000);
			}
		} catch (error) {
			setToast({ message: "Upload failed", type: "error" });
			setTimeout(() => setToast(null), 3000);
		} finally {
			setUploading(false);
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "approved": return "bg-green-100 text-green-800";
			case "rejected": return "bg-red-100 text-red-800";
			default: return "bg-yellow-100 text-yellow-800";
		}
	}

	if (loading) return <div className="p-6">Loading...</div>;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<header className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Image src="/globe.svg" alt="ERP Logo" width={28} height={28} />
							<span className="text-xl font-bold text-slate-900">Driver Dashboard</span>
						</div>
						<div className="flex items-center gap-4">
							<span className="text-slate-600">Welcome, {name}</span>
							<button
								onClick={() => {
									localStorage.removeItem("erp_token");
									router.push("/login");
								}}
								className="text-sm text-slate-600 hover:text-slate-900"
							>
								Logout
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Upload Section */}
				<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-8">
					<h2 className="text-lg font-semibold text-slate-900 mb-4">Upload Proof of Delivery</h2>
					<div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
						<input
							type="file"
							onChange={handleUpload}
							disabled={uploading}
							className="hidden"
							id="file-upload"
							accept="image/*,.pdf"
						/>
						<label
							htmlFor="file-upload"
							className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 hover:bg-slate-50 ${uploading ? "opacity-50 cursor-not-allowed" : ""}`}
						>
							{uploading ? (
								<>
									<div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
									Uploading...
								</>
							) : (
								<>
									<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
									</svg>
									Choose file to upload
								</>
							)}
						</label>
						<p className="mt-2 text-sm text-slate-500">PNG, JPG, PDF up to 10MB</p>
					</div>
				</div>

				{/* PODs List */}
				<div className="bg-white rounded-lg shadow-sm border border-slate-200">
					<div className="px-6 py-4 border-b border-slate-200">
						<h2 className="text-lg font-semibold text-slate-900">My PODs</h2>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Remarks</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-slate-200">
								{pods.length === 0 ? (
									<tr>
										<td colSpan={4} className="px-6 py-12 text-center text-slate-500">
											No PODs uploaded yet
										</td>
									</tr>
								) : (
									pods.map((pod) => (
										<tr key={pod.id}>
											<td className="px-6 py-4 whitespace-nowrap">
												<a
													href={pod.url}
													target="_blank"
													rel="noopener noreferrer"
													className="text-slate-900 hover:text-slate-600 underline"
												>
													View File
												</a>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(pod.status)}`}>
													{pod.status}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
												{new Date(pod.createdAt).toLocaleDateString()}
											</td>
											<td className="px-6 py-4 text-sm text-slate-500">
												{pod.remarks || "-"}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Toast */}
			{toast && (
				<div className="fixed top-4 right-4 z-50">
					<div className={`p-4 rounded-lg shadow-lg ${
						toast.type === "success" ? "bg-green-50 text-green-800 border border-green-200" : "bg-red-50 text-red-800 border border-red-200"
					}`}>
						<div className="flex items-center gap-2">
							{toast.type === "success" ? (
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
								</svg>
							) : (
								<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
									<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
								</svg>
							)}
							{toast.message}
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
