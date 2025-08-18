import { NextRequest, NextResponse } from "next/server";
import { getAllUsersForExport } from "@/server-actions/user";
import * as XLSX from "xlsx";
import { getServerTranslation } from "@/lib/server-translations";

export async function GET(req: NextRequest) {
	const urlParams = Object.fromEntries(req.nextUrl.searchParams.entries());
	const { page, limit, format, ...exportParams } = urlParams;
	const exportFormat = (format || "csv").toLowerCase();

	const users = await getAllUsersForExport(exportParams);

	const nameLabel = await getServerTranslation("User", "name");
	const roleLabel = await getServerTranslation("User", "role");
	const statusLabel = await getServerTranslation("User", "status");
	const createdAtLabel = await getServerTranslation("User", "createdAt");

	const records = users.map((user) => ({
		[nameLabel]: `${user.first_name} ${user.last_name}`,
		"email": user.email,
		[roleLabel]: user.role,
		[statusLabel]: user.status,
		[createdAtLabel]: user.created_at,
	}));

	const filename = `users_${new Date().toISOString().slice(0, 10)}`;

	const worksheet = XLSX.utils.json_to_sheet(records);
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Users");

	if (exportFormat === "xlsx") {
		const buffer = XLSX.write(workbook, {
			type: "buffer",
			bookType: "xlsx",
		});
		return new NextResponse(buffer, {
			status: 200,
			headers: {
				"Content-Type":
					"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"Content-Disposition": `attachment; filename="${filename}.xlsx"`,
			},
		});
	} else {
		const csvString = XLSX.write(workbook, {
			type: "string",
			bookType: "csv",
		});
		return new NextResponse(csvString, {
			status: 200,
			headers: {
				"Content-Type": "text/csv",
				"Content-Disposition": `attachment; filename="${filename}.csv"`,
			},
		});
	}
}
