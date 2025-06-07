import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";

export default async function DashboardPage() {
	const session = await getAuthSession();

    if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="container mx-auto p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-3xl font-bold">Dashboard</h1>
						<p className="text-gray-600 mt-2">
							Welcome back,{" "}
							{session.user.name}
						</p>
					</div>
					<LogoutButton />
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-lg shadow border">
						<h3 className="text-lg font-semibold mb-4">
							User Information
						</h3>
						<div className="space-y-2">
							<p>
								<strong>ID:</strong> {session.user.id}
							</p>
							<p>
								<strong>Name:</strong>{" "}
								{session.user.name}
							</p>
							<p>
								<strong>Email:</strong> {session.user.email}
							</p>
							<p>
								<strong>Role:</strong> {session.user.role}
							</p>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow border">
						<h3 className="text-lg font-semibold mb-4">
							Account Details
						</h3>
						<div className="space-y-2">
							<p>
								<strong>Account Type:</strong> {session.user.role}
							</p>
							<p>
								<strong>Status:</strong>{" "}
								<span className="text-green-600">Active</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
