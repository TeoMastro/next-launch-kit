export type ValidationState = {
	errors: {
		email?: string[];
		password?: string[];
	};
	data: { email: string; password: string } | null;
	success: boolean;
	formData?: { email: string; password: string };
};

export type SignupFormState = {
	success: boolean;
	errors: Record<string, string[]>;
	formData: {
		first_name: string;
		last_name: string;
		email: string;
		password: string;
		confirmPassword: string;
	};
	globalError: string | null;
};