import { useTranslations } from "next-intl";
import LanguageSwitcher from "@/components/language-switcher";

export default function SettingsPage() {
	const t = useTranslations("Settings");

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			<div className="bg-white p-6 rounded-lg shadow border">
				<div className="flex items-center justify-between">
					<span className="text-sm font-medium">
						{t("selectLanguage")}:
					</span>
					<LanguageSwitcher />
				</div>
			</div>
		</div>
	);
}
