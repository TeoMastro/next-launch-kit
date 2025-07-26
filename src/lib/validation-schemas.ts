import { z } from "zod";

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
