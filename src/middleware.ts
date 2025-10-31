import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Protected routes that require authentication
const protectedRoutes = [
    "/profile",
    "/settings",
    "/my-events",
    "/my-learning",
    "/achievements",
    "/complete-profile",
    "/event-details",
]

// Auth routes (accessible only when NOT authenticated)
const authRoutes = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
]

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Get authentication status from cookies
    const token = request.cookies.get("quzuu_auth_token")?.value
    const isAuthenticated = !!token

    console.log("=".repeat(50))
    console.log("🔐 MIDDLEWARE CHECK")
    console.log("📍 Path:", path)
    console.log("🍪 Token:", token ? "EXISTS" : "NOT FOUND")
    console.log("✅ Authenticated:", isAuthenticated)

    // STEP 1: Check authentication for protected routes
    const isProtectedRoute =
        protectedRoutes.some((route) => path.startsWith(route)) || path === "/"

    if (isProtectedRoute && !isAuthenticated) {
        console.log("🚫 BLOCKED: Not authenticated")
        console.log("=".repeat(50))
        const url = new URL("/login", request.url)
        url.searchParams.set("returnUrl", path)
        return NextResponse.redirect(url)
    }

    // STEP 2: Redirect authenticated users away from auth pages
    if (authRoutes.some((route) => path === route) && isAuthenticated) {
        console.log("🔄 REDIRECT: Already authenticated")
        console.log("=".repeat(50))
        return NextResponse.redirect(new URL("/", request.url))
    }

    // STEP 3: Email verification check for authenticated users
    if (isAuthenticated) {
        // Allow access to verify-email page itself
        if (path.startsWith("/verify-email")) {
            console.log("✅ ALLOWED: Email verification page")
            console.log("=".repeat(50))
            return NextResponse.next()
        }

        const isEmailVerified =
            request.cookies.get("quzuu_email_verified")?.value === "true"
        console.log("📧 Email verified:", isEmailVerified)

        if (!isEmailVerified && path !== "/logout") {
            console.log("🚫 BLOCKED: Email not verified")
            console.log("=".repeat(50))
            return NextResponse.redirect(new URL("/verify-email", request.url))
        }

        // STEP 4: Profile completion check
        const isProfileComplete =
            request.cookies.get("quzuu_profile_complete")?.value === "true"
        console.log("👤 Profile complete:", isProfileComplete)

        if (
            isEmailVerified &&
            !isProfileComplete &&
            path !== "/complete-profile" &&
            path !== "/logout"
        ) {
            console.log("🚫 BLOCKED: Profile not complete")
            console.log("=".repeat(50))
            return NextResponse.redirect(
                new URL("/complete-profile", request.url),
            )
        }
    }

    console.log("✅ ALLOWED: Request passed all checks")
    console.log("=".repeat(50))
    return NextResponse.next()
}

// Configure the middleware to run on specific paths
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public directory files (assets, images, etc.)
         * - api routes (internal API endpoints)
         */
        "/((?!_next/static|_next/image|favicon.ico|assets/|api/).*)",
    ],
}
