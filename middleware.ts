import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    console.log("Authenticated user:", req.nextauth.token)
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        if (req.nextUrl.pathname.startsWith("/admin")) {
          return token?.role === "ADMIN"
        }
        
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        
        return true
      },
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/api/protected/:path*"
  ]
}