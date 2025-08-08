import { z } from "zod";
import { Role } from "@prisma/client";

export const signinSchema = z.object({
	email: z.email("invalidEmail"),
	password: z.string().min(1, "passwordTooShort").min(6, "passwordTooShort"),
});

export const signupSchema = z
	.object({
		first_name: z.string().min(2, "firstNameTooShort"),
		last_name: z.string().min(2, "lastNameTooShort"),
		email: z.email("invalidEmail"),
		password: z
			.string()
			.min(8, "passwordTooShort")
			.regex(/[a-z]/, "passwordNeedsLowercase")
			.regex(/\d/, "passwordNeedsNumber")
			.regex(
				/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/,
				"passwordNeedsSpecialChar"
			),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "passwordsDontMatch",
		path: ["confirmPassword"],
	});

export const createUserSchema = z.object({
    first_name: z.string().min(1, "firstNameRequired"),
    last_name: z.string().min(1, "lastNameRequired"),
    email: z.email("invalidEmail"),
    password: z.string().min(6, "passwordMinLength"),
    role: z.enum([Role.ADMIN, Role.USER]),
});

export const updateUserSchema = z.object({
    first_name: z.string().min(1, "firstNameRequired"),
    last_name: z.string().min(1, "lastNameRequired"),
    email: z.email("invalidEmail"),
    password: z.string().optional().refine((val) => {
        if (val && val.length > 0) {
            return val.length >= 6;
        }
        return true;
    }, "passwordMinLength"),
    role: z.enum([Role.ADMIN, Role.USER]),
});

export function formatZodErrors(error: z.ZodError) {
	const fieldErrors: { [key: string]: string[] } = {};

	for (const issue of error.issues) {
		const path = issue.path.join(".");
		if (!fieldErrors[path]) {
			fieldErrors[path] = [];
		}
		fieldErrors[path].push(issue.message);
	}

	return fieldErrors;
}
