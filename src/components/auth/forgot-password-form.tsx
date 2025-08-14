"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { useActionState } from "react";
import { forgotPasswordAction } from "@/server-actions/auth";
import { ForgotPasswordState } from "@/types/auth";

export function ForgotPasswordForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const t = useTranslations("ForgotPassword");
	const tSignIn = useTranslations("SignIn");
	const tResetPassword = useTranslations("ResetPassword");
	const tValidation = useTranslations("Validation");

	const initialState: ForgotPasswordState = {
		errors: {},
		success: false,
		formData: { email: "" },
		globalError: null,
	};

	const [state, formAction] = useActionState(
		forgotPasswordAction,
		initialState
	);

	const handleSubmit = async (formData: FormData) => {
		setIsSubmitting(true);
		formAction(formData);
		setIsSubmitting(false);
	};

	return (
		<Card className="w-full max-w-md mx-auto">
			<CardHeader>
				<CardTitle>{tResetPassword("resetPassword")}</CardTitle>
			</CardHeader>

			<form action={handleSubmit} noValidate>
				<CardContent className="space-y-4 mb-5">
					{state.globalError && (
						<Alert className="border-red-200 bg-red-50 text-red-800">
							<AlertDescription className="text-red-800">
								{t(state.globalError)}
							</AlertDescription>
						</Alert>
					)}

					{state.success && state.message && (
						<Alert className="border-green-200 bg-green-50 text-green-800">
							<AlertDescription className="text-green-800">
								{state.message}
							</AlertDescription>
						</Alert>
					)}

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							name="email"
							type="email"
							placeholder={t("enterEmail")}
							disabled={isSubmitting}
							defaultValue={state.formData?.email || ""}
							className={
								state.errors.email ? "border-red-500" : ""
							}
						/>
						{state.errors.email && (
							<p className="text-sm text-red-500">
								{tValidation(state.errors.email[0])}
							</p>
						)}
					</div>
				</CardContent>

				<CardFooter className="flex flex-col space-y-4">
					<Button
						type="submit"
						className="w-full"
						disabled={isSubmitting || state.success}
					>
						{isSubmitting ? t("sending") : t("sendResetLink")}
					</Button>

					<p className="text-center text-sm text-muted-foreground">
						{t("rememberPassword")}{" "}
						<a
							href="/auth/signin"
							className="font-medium text-primary hover:underline"
						>
							{tSignIn("signIn")}
						</a>
					</p>
				</CardFooter>
			</form>
		</Card>
	);
}
