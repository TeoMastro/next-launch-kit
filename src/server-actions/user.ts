"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { GetUsersParams, GetUsersResult, UserFormState } from "@/types/user";
import { createUserSchema, formatZodErrors, updateUserSchema } from "@/lib/validation-schemas";
import { Role } from "@prisma/client";

async function checkAdminAuth() {
	const session = await getServerSession(authOptions);

	if (!session || session.user.role !== "ADMIN") {
		throw new Error("Unauthorized");
	}

	return session;
}

export async function createUserAction(
	prevState: UserFormState,
	formData: FormData
): Promise<UserFormState> {
	try {
		await checkAdminAuth();

		const data = {
			first_name: formData.get("first_name")?.toString() ?? "",
			last_name: formData.get("last_name")?.toString() ?? "",
			email: formData.get("email")?.toString() ?? "",
			password: formData.get("password")?.toString() ?? "",
			role: formData.get("role")?.toString() as Role ?? ""
		};

		const parsed = createUserSchema.safeParse(data);

		if (!parsed.success) {
			return {
				success: false,
				errors: formatZodErrors(parsed.error),
				formData: { ...data, password: "" },
				globalError: null,
			};
		}

		const trimmedEmail = parsed.data.email.trim().toLowerCase();

		const existingUser = await prisma.user.findUnique({
			where: { email: trimmedEmail },
		});

		if (existingUser) {
			return {
				success: false,
				errors: {},
				formData: { ...parsed.data, password: "" },
				globalError: "userAlreadyExists",
			};
		}

		const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

		await prisma.user.create({
			data: {
				first_name: parsed.data.first_name.trim(),
				last_name: parsed.data.last_name.trim(),
				email: trimmedEmail,
				password: hashedPassword,
				role: parsed.data.role,
			},
		});

		revalidatePath("/admin/users");

		redirect("/admin/user?message=userCreatedSuccess");
	} catch (error) {
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}

		return {
			success: false,
			errors: {},
			formData: {
				first_name: formData.get("first_name")?.toString() ?? "",
				last_name: formData.get("last_name")?.toString() ?? "",
				email: formData.get("email")?.toString() ?? "",
				password: "",
				role: formData.get("role")?.toString() as Role ?? Role.USER
			},
			globalError: "unexpectedError",
		};
	}
}

export async function updateUserAction(
	userId: number,
	prevState: UserFormState,
	formData: FormData
): Promise<UserFormState> {
	try {
		await checkAdminAuth();

		const data = {
			first_name: formData.get("first_name")?.toString() ?? "",
			last_name: formData.get("last_name")?.toString() ?? "",
			email: formData.get("email")?.toString() ?? "",
			password: formData.get("password")?.toString() ?? "",
			role: formData.get("role")?.toString() as Role ?? ""
		};

		const parsed = updateUserSchema.safeParse(data);

		if (!parsed.success) {
			return {
				success: false,
				errors: formatZodErrors(parsed.error),
				formData: { ...data, password: "" },
				globalError: null,
			};
		}

		const trimmedEmail = parsed.data.email.trim().toLowerCase();

		const existingUser = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!existingUser) {
			return {
				success: false,
				errors: {},
				formData: { ...parsed.data, password: "" },
				globalError: "userNotFound",
			};
		}

		const emailTaken = await prisma.user.findFirst({
			where: {
				email: trimmedEmail,
				id: { not: userId },
			},
		});

		if (emailTaken) {
			return {
				success: false,
				errors: {},
				formData: { ...parsed.data, password: "" },
				globalError: "emailAlreadyTaken",
			};
		}

		const updateData: any = {
			first_name: parsed.data.first_name.trim(),
			last_name: parsed.data.last_name.trim(),
			email: trimmedEmail,
			role: parsed.data.role,
		};

		if (parsed.data.password && parsed.data.password.trim() !== "") {
			updateData.password = await bcrypt.hash(parsed.data.password, 12);
		}

		await prisma.user.update({
			where: { id: userId },
			data: updateData,
		});

		revalidatePath("/admin/users");
		redirect("/admin/user?message=userUpdatedSuccess");
	} catch (error) {
		if (error instanceof Error && error.message === "NEXT_REDIRECT") {
			throw error;
		}

		return {
			success: false,
			errors: {},
			formData: {
				first_name: formData.get("first_name")?.toString() ?? "",
				last_name: formData.get("last_name")?.toString() ?? "",
				email: formData.get("email")?.toString() ?? "",
				password: "",
				role: formData.get("role")?.toString() as Role ?? Role.USER
			},
			globalError: "unexpectedError",
		};
	}
}

export async function deleteUserAction(userId: number) {
	try {
		const session = await checkAdminAuth();

		if (+session.user.id === userId) {
			throw new Error("Cannot delete own account");
		}

		const existingUser = await prisma.user.findUnique({
			where: { id: userId },
		});

		if (!existingUser) {
			throw new Error("User not found");
		}

		await prisma.user.delete({
			where: { id: userId },
		});

		revalidatePath("/admin/users");

		return { success: true };
	} catch (error) {
		throw error;
	}
}

export async function getUserById(userId: number) {
    try {
        await checkAdminAuth();

        if (isNaN(userId)) {
            return false;
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                last_name: true,
                email: true,
                role: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!user) {
            return false;
        }

        return user;
    } catch (error) {
        throw error;
    }
}

export async function getUsersWithPagination(
	params: GetUsersParams
): Promise<GetUsersResult> {
	const page = parseInt(params.page || "1");
	const limit = parseInt(params.limit || "10");
	const search = params.search || "";
	const roleFilter = params.roleFilter || "all";
	const sortField = params.sortField || "created_at";
	const sortDirection = (params.sortDirection as "asc" | "desc") || "desc";

	const offset = (page - 1) * limit;

	const whereClause: any = {};

	if (search) {
		whereClause.OR = [
			{ first_name: { contains: search, mode: "insensitive" } },
			{ last_name: { contains: search, mode: "insensitive" } },
			{ email: { contains: search, mode: "insensitive" } },
		];
	}

	if (roleFilter !== "all") {
		whereClause.role = roleFilter as "USER" | "ADMIN";
	}

	const orderBy: any = {};
	if (sortField === "name") {
		orderBy.first_name = sortDirection;
	} else {
		orderBy[sortField] = sortDirection;
	}

	const [users, totalCount] = await Promise.all([
		prisma.user.findMany({
			where: whereClause,
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				role: true,
				created_at: true,
				updated_at: true,
			},
			orderBy,
			skip: offset,
			take: limit,
		}),
		prisma.user.count({
			where: whereClause,
		}),
	]);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		users,
		totalCount,
		totalPages,
		currentPage: page,
		limit,
	};
}
