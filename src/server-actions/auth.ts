"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { getValidationTranslation } from "@/lib/server-translations";
import { ValidationState } from "@/types/auth";
import { SignupFormState } from "@/types/auth";
import { signinSchema, formatZodErrors, signupSchema } from "@/lib/validation-schemas";

export async function validateSigninData(
	prevState: ValidationState,
	formData: FormData
): Promise<ValidationState> {
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	const validatedFields = signinSchema.safeParse({
		email,
		password,
	});

	if (!validatedFields.success) {
		return {
			errors: formatZodErrors(validatedFields.error),
			data: null,
			success: false,
			formData: { email, password: "" },
		};
	}

	return {
		errors: {},
		data: validatedFields.data,
		success: true,
		formData: { email, password: "" },
	};
}

export async function signUpAction(
	prevState: SignupFormState,
	formData: FormData
): Promise<SignupFormState> {
	const data = {
		first_name: formData.get("first_name")?.toString() ?? "",
		last_name: formData.get("last_name")?.toString() ?? "",
		email: formData.get("email")?.toString() ?? "",
		password: formData.get("password")?.toString() ?? "",
		confirmPassword: formData.get("confirmPassword")?.toString() ?? "",
	};

	const parsed = signupSchema.safeParse(data);

	if (!parsed.success) {
		return {
			success: false,
			errors: formatZodErrors(parsed.error),
			formData: { ...data, password: "", confirmPassword: "" },
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
			formData: { ...parsed.data, password: "", confirmPassword: "" },
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
		},
	});

	const successMessage = await getValidationTranslation(
		"accountCreatedSuccess"
	);

	redirect("/auth/signin?message=" + encodeURIComponent(successMessage));
}
