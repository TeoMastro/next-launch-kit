import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
	function middleware(req) {
		if (
			req.nextUrl.pathname.startsWith("/admin") &&
			req.nextauth.token?.role !== "ADMIN" &&
			!!req.nextauth.token
		) {
			return NextResponse.redirect(new URL("/404", req.url));
		}
	},
	{
		callbacks: {
			authorized: ({ token, req }) => {
				if (req.nextUrl.pathname.startsWith("/admin") && !token) {
					return false;
				}

				if (
					req.nextUrl.pathname.startsWith("/profile") ||
					req.nextUrl.pathname.startsWith("/settings") ||
					req.nextUrl.pathname.startsWith("/dashboard")
				) {
					return !!token;
				}

				if (req.nextUrl.pathname.startsWith("/api")) {
					return !!token;
				}

				return true;
			},
		},
		pages: {
			signIn: "/auth/signin",
		},
	}
);

export const config = {
	matcher: [
		"/dashboard/:path*",
		"/profile/:path*",
		"/settings/:path*",
		"/admin/:path*",
		"/api/:path*",
	],
};
