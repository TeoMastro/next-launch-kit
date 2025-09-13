import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compareSync } from 'bcrypt-edge';
import { Status } from '@prisma/client';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = compareSync(
          credentials.password as string,
          user.password
        );

        if (!isPasswordValid || user.status !== Status.ACTIVE) {
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
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          let existingUser = await prisma.user.findUnique({
            where: { email: user.email! },
          });

          if (!existingUser) {
            existingUser = await prisma.user.create({
              data: {
                email: user.email!,
                first_name: user.name?.split(' ')[0] || '',
                last_name: user.name?.split(' ').slice(1).join(' ') || '',
                image: user.image,
                status: Status.ACTIVE,
              },
            });
          }

          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: account.provider,
                providerAccountId: account.providerAccountId!,
              },
            },
            update: {
              access_token: account.access_token || null,
              expires_at: account.expires_at
                ? Number(account.expires_at)
                : null,
              id_token: account.id_token || null,
              refresh_token: account.refresh_token || null,
              scope: account.scope || null,
              session_state: account.session_state
                ? String(account.session_state)
                : null,
              token_type: account.token_type || null,
            },
            create: {
              userId: existingUser.id,
              type: account.type!,
              provider: account.provider,
              providerAccountId: account.providerAccountId!,
              access_token: account.access_token || null,
              expires_at: account.expires_at
                ? Number(account.expires_at)
                : null,
              id_token: account.id_token || null,
              refresh_token: account.refresh_token || null,
              scope: account.scope || null,
              session_state: account.session_state
                ? String(account.session_state)
                : null,
              token_type: account.token_type || null,
            },
          });

          return true;
        } catch (error) {
          console.error('Error in Google signIn:', error);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider === 'google') {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        });

        if (dbUser) {
          token.role = dbUser.role;
          token.id = dbUser.id.toString();
          token.status = dbUser.status;
        }
      } else if (user) {
        token.role = user.role;
        token.id = user.id;
        token.status = user.status;
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
    signIn: '/auth/signin',
  },
});
