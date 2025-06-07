import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/auth/logout-button";
import LanguageSwitcher from "@/components/language-switcher";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
	const session = await getAuthSession();
	const t = await getTranslations("Dashboard");

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="container mx-auto p-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex justify-between items-start mb-8">
					<div className="flex-1">
						<h1 className="text-3xl font-bold">{t("title")}</h1>
						<p className="text-gray-600 mt-2">
							{t("welcomeBack", { name: session.user.name })}
						</p>
					</div>

					<div className="flex items-center gap-4">
						<LanguageSwitcher />
						<LogoutButton />
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div className="bg-white p-6 rounded-lg shadow border">
						<h3 className="text-lg font-semibold mb-4">
							{t("userInformation")}
						</h3>
						<div className="space-y-2">
							<p>
								<strong>{t("id")}:</strong> {session.user.id}
							</p>
							<p>
								<strong>{t("name")}:</strong>{" "}
								{session.user.name}
							</p>
							<p>
								<strong>Email:</strong>{" "}
								{session.user.email}
							</p>
							<p>
								<strong>{t("role")}:</strong>{" "}
								{session.user.role}
							</p>
						</div>
					</div>

					<div className="bg-white p-6 rounded-lg shadow border">
						<h3 className="text-lg font-semibold mb-4">
							{t("accountDetails")}
						</h3>
						<div className="space-y-2">
							<p>
								<strong>{t("accountType")}:</strong>{" "}
								{session.user.role}
							</p>
							<p>
								<strong>{t("status")}:</strong>{" "}
								<span className="text-green-600">
									{t("active")}
								</span>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
