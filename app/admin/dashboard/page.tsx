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
	driver: {
		id: string;
		name: string;
		email: string;
	};
}

export default function AdminDashboard() {
	const router = useRouter();
	const [name, setName] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);
	const [pods, setPods] = useState<POD[]>([]);
	const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
	const [selectedPod, setSelectedPod] = useState<POD | null>(null);
	const [remarks, setRemarks] = useState("");
	const [actionLoading, setActionLoading] = useState(false);
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
			const res = await fetch("/api/pods/all", { headers: { Authorization: `Bearer ${token}` } });
			if (res.ok) {
				const data = await res.json();
				setPods(data.pods);
			}
		} catch (error) {
			console.error("Failed to load PODs:", error);
		}
	}

	async function updatePODStatus(podId: string, status: "approved" | "rejected") {
		const token = localStorage.getItem("erp_token");
		if (!token) return;

		setActionLoading(true);
		try {
			const res = await fetch(`/api/pods/${podId}`, {
				method: "PATCH",
				headers: { 
					"Authorization": `Bearer ${token}`,
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ status, remarks }),
			});

			if (res.ok) {
				setToast({ message: `POD ${status} successfully!`, type: "success" });
				setTimeout(() => setToast(null), 3000);
				loadPODs(token);
				setSelectedPod(null);
				setRemarks("");
			} else {
				const error = await res.json();
				setToast({ message: error.error || "Action failed", type: "error" });
				setTimeout(() => setToast(null), 3000);
			}
		} catch (error) {
			setToast({ message: "Action failed", type: "error" });
			setTimeout(() => setToast(null), 3000);
		} finally {
			setActionLoading(false);
		}
	}

	function getStatusColor(status: string) {
		switch (status) {
			case "approved": return "bg-green-100 text-green-800";
			case "rejected": return "bg-red-100 text-red-800";
			default: return "bg-yellow-100 text-yellow-800";
		}
	}

	const filteredPODs = pods.filter(pod => filter === "all" || pod.status === filter);

	if (loading) return <div className="p-6">Loading...</div>;

	return (
		<div className="min-h-screen bg-slate-50">
			{/* Header */}
			<header className="bg-white border-b border-slate-200">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-3">
							<Image src="/globe.svg" alt="ERP Logo" width={28} height={28} />
							<span className="text-xl font-bold text-slate-900">Admin Dashboard</span>
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
				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
					<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
						<div className="text-2xl font-bold text-slate-900">{pods.length}</div>
						<div className="text-sm text-slate-500">Total PODs</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
						<div className="text-2xl font-bold text-yellow-600">{pods.filter(p => p.status === "pending").length}</div>
						<div className="text-sm text-slate-500">Pending</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
						<div className="text-2xl font-bold text-green-600">{pods.filter(p => p.status === "approved").length}</div>
						<div className="text-sm text-slate-500">Approved</div>
					</div>
					<div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
						<div className="text-2xl font-bold text-red-600">{pods.filter(p => p.status === "rejected").length}</div>
						<div className="text-sm text-slate-500">Rejected</div>
					</div>
				</div>

				{/* PODs Table */}
				<div className="bg-white rounded-lg shadow-sm border border-slate-200">
					<div className="px-6 py-4 border-b border-slate-200">
						<div className="flex items-center justify-between">
							<h2 className="text-lg font-semibold text-slate-900">All PODs</h2>
							<div className="flex gap-2">
								<button
									onClick={() => setFilter("all")}
									className={`px-3 py-1 text-sm rounded-md ${
										filter === "all" ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-700"
									}`}
								>
									All
								</button>
								<button
									onClick={() => setFilter("pending")}
									className={`px-3 py-1 text-sm rounded-md ${
										filter === "pending" ? "bg-yellow-600 text-white" : "bg-slate-100 text-slate-700"
									}`}
								>
									Pending
								</button>
								<button
									onClick={() => setFilter("approved")}
									className={`px-3 py-1 text-sm rounded-md ${
										filter === "approved" ? "bg-green-600 text-white" : "bg-slate-100 text-slate-700"
									}`}
								>
									Approved
								</button>
								<button
									onClick={() => setFilter("rejected")}
									className={`px-3 py-1 text-sm rounded-md ${
										filter === "rejected" ? "bg-red-600 text-white" : "bg-slate-100 text-slate-700"
									}`}
								>
									Rejected
								</button>
							</div>
						</div>
					</div>
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-slate-200">
							<thead className="bg-slate-50">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Driver</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">File</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-slate-200">
								{filteredPODs.length === 0 ? (
									<tr>
										<td colSpan={5} className="px-6 py-12 text-center text-slate-500">
											No PODs found
										</td>
									</tr>
								) : (
									filteredPODs.map((pod) => (
										<tr key={pod.id}>
											<td className="px-6 py-4 whitespace-nowrap">
												<div>
													<div className="text-sm font-medium text-slate-900">{pod.driver.name}</div>
													<div className="text-sm text-slate-500">{pod.driver.email}</div>
												</div>
											</td>
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
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												{pod.status === "pending" ? (
													<div className="flex gap-2">
														<button
															onClick={() => setSelectedPod(pod)}
															className="text-green-600 hover:text-green-900"
														>
															Approve
														</button>
														<button
															onClick={() => setSelectedPod(pod)}
															className="text-red-600 hover:text-red-900"
														>
															Reject
														</button>
													</div>
												) : (
													<span className="text-slate-400">-</span>
												)}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			</div>

			{/* Action Modal */}
			{selectedPod && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
						<h3 className="text-lg font-semibold text-slate-900 mb-4">
							{selectedPod.status === "pending" ? "Approve/Reject POD" : "Update POD"}
						</h3>
						<div className="mb-4">
							<label className="block text-sm font-medium text-slate-700 mb-2">
								Remarks (optional)
							</label>
							<textarea
								value={remarks}
								onChange={(e) => setRemarks(e.target.value)}
								className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-slate-900 focus:border-transparent"
								rows={3}
								placeholder="Add remarks..."
							/>
						</div>
						<div className="flex gap-3 justify-end">
							<button
								onClick={() => {
									setSelectedPod(null);
									setRemarks("");
								}}
								className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200"
							>
								Cancel
							</button>
							<button
								onClick={() => updatePODStatus(selectedPod.id, "approved")}
								disabled={actionLoading}
								className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:opacity-50"
							>
								{actionLoading ? "Processing..." : "Approve"}
							</button>
							<button
								onClick={() => updatePODStatus(selectedPod.id, "rejected")}
								disabled={actionLoading}
								className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
							>
								{actionLoading ? "Processing..." : "Reject"}
							</button>
						</div>
					</div>
				</div>
			)}

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
