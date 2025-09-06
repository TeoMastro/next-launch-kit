'use server';

import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { redirect } from 'next/navigation';
import { getServerTranslation } from '@/lib/server-translations';
import {
  ForgotPasswordState,
  ResetPasswordState,
  ValidationState,
} from '@/types/auth';
import { SignupFormState } from '@/types/auth';
import {
  signinSchema,
  formatZodErrors,
  signupSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@/lib/validation-schemas';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';
import { Status } from '@prisma/client';
import logger from '@/lib/logger';

export async function validateSigninData(
  prevState: ValidationState,
  formData: FormData
): Promise<ValidationState> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const validatedFields = signinSchema.safeParse({
    email,
    password,
  });

  if (!validatedFields.success) {
    return {
      errors: formatZodErrors(validatedFields.error),
      data: null,
      success: false,
      formData: { email, password: '' },
    };
  }

  return {
    errors: {},
    data: validatedFields.data,
    success: true,
    formData: { email, password: '' },
  };
}

export async function signUpAction(
  prevState: SignupFormState,
  formData: FormData
): Promise<SignupFormState> {
  const data = {
    first_name: formData.get('first_name')?.toString() ?? '',
    last_name: formData.get('last_name')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    confirmPassword: formData.get('confirmPassword')?.toString() ?? '',
  };

  const parsed = signupSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: formatZodErrors(parsed.error),
      formData: { ...data, password: '', confirmPassword: '' },
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
      formData: { ...parsed.data, password: '', confirmPassword: '' },
      globalError: 'userAlreadyExists',
    };
  }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12);
  const verificationToken = uuidv4();

  try {
    const newUser = await prisma.user.create({
      data: {
        first_name: parsed.data.first_name.trim(),
        last_name: parsed.data.last_name.trim(),
        email: trimmedEmail,
        password: hashedPassword,
        status: Status.UNVERIFIED,
        email_verification_token: verificationToken,
      },
    });

    await sendVerificationEmail(
      trimmedEmail,
      verificationToken,
      `${parsed.data.first_name} ${parsed.data.last_name}`
    );

    logger.info('User signed up successfully', {
      userId: newUser.id,
    });
  } catch (error) {
    logger.error('Error during user signup', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      action: 'signUp',
    });

    return {
      success: false,
      errors: {},
      formData: { ...parsed.data, password: '', confirmPassword: '' },
      globalError: 'accountCreationFailed',
    };
  }
  const successMessage = await getServerTranslation(
    'SignUp',
    'accountCreatedCheckEmail'
  );
  redirect('/auth/signin?message=' + encodeURIComponent(successMessage));
}

async function sendVerificationEmail(
  email: string,
  token: string,
  userName: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const verificationUrl = `${process.env.AUTH_URL}/auth/verify-email?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Welcome! Please verify your email address',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Welcome ${userName}!</h1>
                <p>Thank you for signing up. Please verify your email address to activate your account.</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${verificationUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Verify Email Address
                    </a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
                <p style="color: #888; font-size: 14px;">This link will expire in 24 hours.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #888; font-size: 12px;">
                    If you didn't create an account, please ignore this email.
                </p>
            </div>
        `,
  });
}

export async function verifyEmailAction(
  token: string
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await prisma.user.findUnique({
      where: { email_verification_token: token },
    });

    if (!user) {
      return {
        success: false,
        message: await getServerTranslation('VerifyEmail', 'verificationError'),
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        status: Status.ACTIVE,
        email_verification_token: null,
      },
    });

    logger.info('Email verified successfully', {
      userId: user.id,
    });

    return {
      success: true,
      message: await getServerTranslation(
        'VerifyEmail',
        'verificationSuccessRedirect'
      ),
    };
  } catch (error) {
    logger.error('Error during email verification', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      action: 'verifyEmail',
    });

    return {
      success: false,
      message: await getServerTranslation('VerifyEmail', 'errorTitle'),
    };
  }
}

export async function forgotPasswordAction(
  prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const email = formData.get('email')?.toString() ?? '';

  const parsed = forgotPasswordSchema.safeParse({ email });

  if (!parsed.success) {
    return {
      success: false,
      errors: formatZodErrors(parsed.error),
      formData: { email },
      globalError: null,
    };
  }

  const trimmedEmail = parsed.data.email.trim().toLowerCase();

  try {
    const user = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (user) {
      const resetToken = uuidv4();
      const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await prisma.user.update({
        where: { id: user.id },
        data: {
          password_reset_token: resetToken,
          password_reset_expires: resetExpires,
        },
      });

      await sendPasswordResetEmail(
        trimmedEmail,
        resetToken,
        `${user.first_name} ${user.last_name}`
      );

      logger.info('Password reset requested', {
        userId: user.id,
      });
    }

    return {
      success: true,
      errors: {},
      formData: { email: '' },
      globalError: null,
      message: await getServerTranslation('ForgotPassword', 'resetEmailSent'),
    };
  } catch (error) {
    logger.error('Error during forgot password', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      action: 'forgotPassword',
    });

    return {
      success: false,
      errors: {},
      formData: { email },
      globalError: 'somethingWentWrong',
    };
  }
}

export async function resetPasswordAction(
  token: string,
  prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const data = {
    password: formData.get('password')?.toString() ?? '',
    confirmPassword: formData.get('confirmPassword')?.toString() ?? '',
  };

  const parsed = resetPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return {
      success: false,
      errors: formatZodErrors(parsed.error),
      formData: { password: '', confirmPassword: '' },
      globalError: null,
    };
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        password_reset_token: token,
        password_reset_expires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return {
        success: false,
        errors: {},
        formData: { password: '', confirmPassword: '' },
        globalError: 'invalidOrExpiredToken',
      };
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        password_reset_token: null,
        password_reset_expires: null,
      },
    });

    logger.info('Password reset successfully', {
      userId: user.id,
    });
  } catch (error) {
    logger.error('Error during password reset', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      action: 'resetPassword',
    });

    return {
      success: false,
      errors: {},
      formData: { password: '', confirmPassword: '' },
      globalError: 'somethingWentWrong',
    };
  }
  const successMessage = await getServerTranslation(
    'ResetPassword',
    'passwordResetSuccess'
  );

  redirect('/auth/signin?message=' + encodeURIComponent(successMessage));
}

async function sendPasswordResetEmail(
  email: string,
  token: string,
  userName: string
) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    requireTLS: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const resetUrl = `${process.env.AUTH_URL}/auth/reset-password?token=${token}`;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'Password Reset Request',
    html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #333;">Password Reset Request</h1>
                <p>Hi ${userName},</p>
                <p>You requested a password reset for your account. Click the button below to reset your password:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${resetUrl}" 
                       style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                        Reset Password
                    </a>
                </div>
                <p>Or copy and paste this link in your browser:</p>
                <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                <p style="color: #888; font-size: 14px;">This link will expire in 24 hours.</p>
                <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
                <p style="color: #888; font-size: 12px;">
                    If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
                </p>
            </div>
        `,
  });
}
