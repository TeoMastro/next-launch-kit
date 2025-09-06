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

export type ForgotPasswordState = {
  success: boolean;
  errors: Record<string, string[]>;
  formData: { email: string };
  globalError: string | null;
  message?: string;
};

export type ResetPasswordState = {
  success: boolean;
  errors: Record<string, string[]>;
  formData: { password: string; confirmPassword: string };
  globalError: string | null;
};
