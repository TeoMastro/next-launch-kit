"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { GetUsersParams, GetUsersResult, GetUsersResultWithoutPagination, User, UserFormState } from "@/types/user";
import {
	createUserSchema,
	formatZodErrors,
	updateUserSchema,
} from "@/lib/validation-schemas";
import { Role, Status } from "@prisma/client";
import logger from "@/lib/logger";

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
		const session = await checkAdminAuth();

		const data = {
			first_name: formData.get("first_name")?.toString() ?? "",
			last_name: formData.get("last_name")?.toString() ?? "",
			email: formData.get("email")?.toString() ?? "",
			password: formData.get("password")?.toString() ?? "",
			role: (formData.get("role")?.toString() as Role) ?? Role.USER,
			status:
				(formData.get("status")?.toString() as Status) ?? Status.ACTIVE,
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

		const newUser = await prisma.user.create({
			data: {
				first_name: parsed.data.first_name.trim(),
				last_name: parsed.data.last_name.trim(),
				email: trimmedEmail,
				password: hashedPassword,
				role: parsed.data.role,
				status: parsed.data.status,
			},
		});

		logger.info("User created successfully", {
			adminId: session.user.id,
			createdUserId: newUser.id,
		});

		revalidatePath("/admin/users");
	} catch (error) {
		logger.error("Unexpected error during user creation", {
			error: (error as Error).message,
			stack: (error as Error).stack,
			action: "createUser",
		});

		return {
			success: false,
			errors: {},
			formData: {
				first_name: formData.get("first_name")?.toString() ?? "",
				last_name: formData.get("last_name")?.toString() ?? "",
				email: formData.get("email")?.toString() ?? "",
				password: "",
				role: (formData.get("role")?.toString() as Role) ?? Role.USER,
				status:
					(formData.get("status")?.toString() as Status) ??
					Status.ACTIVE,
			},
			globalError: "unexpectedError",
		};
	}
	redirect("/admin/user?message=userCreatedSuccess");
}

export async function updateUserAction(
	userId: number,
	prevState: UserFormState,
	formData: FormData
): Promise<UserFormState> {
	try {
		const session = await checkAdminAuth();

		const data = {
			first_name: formData.get("first_name")?.toString() ?? "",
			last_name: formData.get("last_name")?.toString() ?? "",
			email: formData.get("email")?.toString() ?? "",
			password: formData.get("password")?.toString() ?? "",
			role: (formData.get("role")?.toString() as Role) ?? Role.USER,
			status:
				(formData.get("status")?.toString() as Status) ?? Status.ACTIVE,
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
			status: parsed.data.status,
		};

		if (parsed.data.password && parsed.data.password.trim() !== "") {
			updateData.password = await bcrypt.hash(parsed.data.password, 12);
		}

		await prisma.user.update({
			where: { id: userId },
			data: updateData,
		});

		logger.info("User updated successfully", {
			adminId: session.user.id,
			updatedUserId: userId,
		});

		revalidatePath("/admin/users");
	} catch (error) {
		logger.error("Unexpected error during user update", {
			error: (error as Error).message,
			stack: (error as Error).stack,
			action: "updateUser",
		});

		return {
			success: false,
			errors: {},
			formData: {
				first_name: formData.get("first_name")?.toString() ?? "",
				last_name: formData.get("last_name")?.toString() ?? "",
				email: formData.get("email")?.toString() ?? "",
				password: "",
				role: (formData.get("role")?.toString() as Role) ?? Role.USER,
				status:
					(formData.get("status")?.toString() as Status) ??
					Status.ACTIVE,
			},
			globalError: "unexpectedError",
		};
	}
	redirect("/admin/user?message=userUpdatedSuccess");
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

		logger.info("User deleted successfully", {
			adminId: session.user.id,
			deletedUserId: userId,
		});

		revalidatePath("/admin/users");

		return { success: true };
	} catch (error) {
		logger.error("Unexpected error during user deletion", {
			error: (error as Error).message,
			stack: (error as Error).stack,
			action: "deleteUser",
		});

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
				status: true,
				created_at: true,
				updated_at: true,
			},
		});

		if (!user) {
			return false;
		}

		return user;
	} catch (error) {
		logger.error("Error fetching user by ID", {
			error: (error as Error).message,
			stack: (error as Error).stack,
			action: "getUserById",
		});
		throw error;
	}
}

async function fetchUsers(params: GetUsersParams & { paginate?: boolean }) {
	const page = parseInt(params.page || "1");
	const limit = parseInt(params.limit || "10");
	const search = params.search || "";
	const roleFilter = params.roleFilter || "all";
	const statusFilter = params.statusFilter || "all";
	const sortField = params.sortField || "created_at";
	const sortDirection = (params.sortDirection as "asc" | "desc") || "desc";
	const paginate = params.paginate ?? false;

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

	if (statusFilter !== "all") {
		whereClause.status = statusFilter as
			| "ACTIVE"
			| "INACTIVE"
			| "UNVERIFIED";
	}

	const orderBy: any = {};
	if (sortField === "name") {
		orderBy.first_name = sortDirection;
	} else {
		orderBy[sortField] = sortDirection;
	}

	if (paginate) {
		const [users, totalCount] = await Promise.all([
			prisma.user.findMany({
				where: whereClause,
				select: {
					id: true,
					first_name: true,
					last_name: true,
					email: true,
					role: true,
					status: true,
					created_at: true,
					updated_at: true,
				},
				orderBy,
				skip: offset,
				take: limit,
			}),
			prisma.user.count({ where: whereClause }),
		]);

		const totalPages = Math.ceil(totalCount / limit);

		return { users, totalCount, totalPages, currentPage: page, limit };
	} else {
		const users = await prisma.user.findMany({
			where: whereClause,
			select: {
				id: true,
				first_name: true,
				last_name: true,
				email: true,
				role: true,
				status: true,
				created_at: true,
				updated_at: true,
			},
			orderBy,
		});

		return { users };
	}
}

export async function getUsersWithPagination(
  params: GetUsersParams
): Promise<GetUsersResult> {
  return fetchUsers({ ...params, paginate: true }) as Promise<GetUsersResult>;
}

export async function getAllUsersForExport(
  params: Omit<GetUsersParams, "page" | "limit">
): Promise<User[]> {
  const result = await fetchUsers({ ...params, paginate: false });
  return (result as GetUsersResultWithoutPagination).users;
}
