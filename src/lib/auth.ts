import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth/next";
import { Status } from "@prisma/client";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email },
				});

				if (!user || !user.password) {
					return null;
				}

				const isPasswordValid = await bcrypt.compare(
					credentials.password,
					user.password
				);

				if (!isPasswordValid) {
					return null;
				}

				if (user.status !== Status.ACTIVE) {
					return null;
				}

				return {
					id: user.id.toString(),
					email: user.email,
					name: `${user.first_name} ${user.last_name}`,
					role: user.role,
					status: user.status,
				};
			},
		}),
	],
	session: {
		strategy: "jwt",
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.role = user.role;
				token.id = user.id;
				token.status = user.status;
			}

			if (token.id) {
				const dbUser = await prisma.user.findUnique({
					where: { id: parseInt(token.id as string) },
					select: {
						status: true,
						role: true,
						first_name: true,
						last_name: true,
					},
				});

				if (dbUser) {
					token.status = dbUser.status;
					token.role = dbUser.role;
					token.name = `${dbUser.first_name} ${dbUser.last_name}`;
				} else {
					token.status = Status.INACTIVE;
				}
			}
			return token;
		},
		async session({ session, token }) {
			if (token && session.user) {
				session.user.id = token.id;
				session.user.role = token.role;
				session.user.status = token.status;
			}
			return session;
		},
	},
	pages: {
		signIn: "/auth/signin",
	},
};

export const getAuthSession = () => getServerSession(authOptions);
