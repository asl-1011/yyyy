import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    // Extra hardening: block spoofed headers if they appear
    const forbiddenHeaders = [
      "x-middleware-subrequest",
      "x-forwarded-for",
      "x-original-url",
      "x-rewrite-url",
      "x-user-role",
    ]

    for (const header of forbiddenHeaders) {
      if (req.headers.get(header)) {
        return new NextResponse("Forbidden", { status: 403 })
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // 🔒 Protect admin routes
        if (pathname.startsWith("/admin")) {
          return token?.role === "admin"
        }

        // 🔒 Protect authenticated user routes
        if (
          pathname.startsWith("/cart") ||
          pathname.startsWith("/orders") ||
          pathname.startsWith("/checkout")
        ) {
          return !!token
        }

        // Public routes allowed
        return true
      },
    },
  },
)

export const config = {
  matcher: [
    "/admin/:path*",
    "/cart/:path*",
    "/orders/:path*",
    "/checkout/:path*",
  ],
}
