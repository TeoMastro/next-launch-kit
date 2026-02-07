import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from '@/lib/prisma';
import { nextCookies } from 'better-auth/next-js';
import nodemailer from 'nodemailer';
import { Status } from '@prisma/client';

const smtpTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  requireTLS: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || process.env.AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET || process.env.AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 60 * 60 * 24, // 24 hours
    sendVerificationEmail: async ({ user, url }) => {
      void smtpTransporter.sendMail({
        from: process.env.SMTP_FROM,
        to: user.email,
        subject: 'Welcome! Please verify your email address',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #333;">Welcome ${user.name || ''}!</h1>
            <p>Thank you for signing up. Please verify your email address to activate your account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}"
                 style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            <p>Or copy and paste this link in your browser:</p>
            <p style="word-break: break-all; color: #666;">${url}</p>
            <p style="color: #888; font-size: 14px;">This link will expire in 24 hours.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
            <p style="color: #888; font-size: 12px;">
              If you didn't create an account, please ignore this email.
            </p>
          </div>
        `,
      });
    },
    afterEmailVerification: async (user) => {
      await prisma.user.update({
        where: { id: Number(user.id) },
        data: { status: Status.ACTIVE },
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    },
  },
  user: {
    modelName: 'User',
    additionalFields: {
      first_name: {
        type: 'string',
        required: false,
      },
      last_name: {
        type: 'string',
        required: false,
      },
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
      },
      status: {
        type: 'string',
        required: false,
        defaultValue: 'UNVERIFIED',
      },
      password_reset_token: {
        type: 'string',
        required: false,
      },
      password_reset_expires: {
        type: 'date',
        required: false,
      },
      stripe_customer_id: {
        type: 'string',
        required: false,
      },
      stripe_subscription_id: {
        type: 'string',
        required: false,
      },
      subscription_status: {
        type: 'string',
        required: false,
      },
      subscription_end_date: {
        type: 'date',
        required: false,
      },
    },
  },
  account: {
    modelName: 'Account',
  },
  session: {
    modelName: 'Session',
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          // Social sign-in users have emailVerified=true, set status to ACTIVE
          if (user.emailVerified) {
            await prisma.user.update({
              where: { id: Number(user.id) },
              data: { status: Status.ACTIVE },
            });
          }
        },
      },
    },
  },
  advanced: {
    database: {
      useNumberId: true,
    },
  },
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
