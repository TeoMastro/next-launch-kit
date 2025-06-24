import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";

export default async function DashboardPage() {
	const session = await getAuthSession();
	const t = await getTranslations("Dashboard");

	if (!session) {
		redirect("/auth/signin");
	}

	return (
		<div className="container mx-auto">
			<p>{t("welcomeBack", { name: session.user.name })}</p>
		</div>
	);
}
