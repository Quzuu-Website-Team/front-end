// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { externalLogin } from "@/lib/api"
import { cookies } from "next/headers"

// Check required environment variables
if (!process.env.GOOGLE_CLIENT_ID) {
    throw new Error("Missing GOOGLE_CLIENT_ID environment variable")
}

if (!process.env.GOOGLE_CLIENT_SECRET) {
    throw new Error("Missing GOOGLE_CLIENT_SECRET environment variable")
}

if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("Missing NEXTAUTH_SECRET environment variable")
}

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                    scope: "openid email profile",
                },
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            console.log("🔐 SignIn callback triggered")
            console.log("👤 User:", {
                id: user.id,
                email: user.email,
                name: user.name,
            })
            console.log("🔑 Account provider:", account?.provider)

            if (account?.provider === "google") {
                try {
                    // Check if we have id_token
                    if (!account.id_token) {
                        console.error("❌ No id_token received from Google")
                        return false
                    }

                    console.log(
                        "✅ ID token received, calling backend with oauth_id...",
                    )

                    // Call your backend API to handle OAuth login
                    const response = await externalLogin(
                        account.id_token, // Send id_token as oauth_id
                        "google",
                        true, // is_agree_terms
                        false, // is_sexual_disease
                    )

                    console.log("✅ Backend OAuth response:", response)

                    // Store for JWT callback
                    user.backendToken = response.token
                    user.accountData = response.account

                    const cookieStore = cookies()
                    // Auth token
                    cookieStore.set("quzuu_auth_token", response.token, {
                        httpOnly: false,
                        secure: process.env.NODE_ENV === "production",
                        sameSite: "lax",
                        path: "/",
                        maxAge: 60 * 60 * 24 * 7, // 7 days
                    })

                    // Email verification status
                    cookieStore.set(
                        "quzuu_email_verified",
                        response.account.is_email_verified ? "true" : "false",
                        {
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                            path: "/",
                            maxAge: 60 * 60 * 24 * 7,
                        },
                    )

                    // Profile completion status
                    cookieStore.set(
                        "quzuu_profile_complete",
                        response.account.is_detail_completed ? "true" : "false",
                        {
                            httpOnly: false,
                            secure: process.env.NODE_ENV === "production",
                            sameSite: "lax",
                            path: "/",
                            maxAge: 60 * 60 * 24 * 7,
                        },
                    )

                    console.log("✅ User authentication data:", {
                        id: response.account.id,
                        email: response.account.email,
                        is_email_verified: response.account.is_email_verified,
                        is_detail_completed:
                            response.account.is_detail_completed,
                        token_length: response.token.length,
                    })

                    return true
                } catch (error) {
                    console.error("❌ OAuth login failed:", error)
                    return false
                }
            }
            return true
        },
        async jwt({ token, user, account }) {
            // Store backend token in JWT for client-side access
            if (user?.backendToken) {
                console.log("🎫 Storing backend data in JWT")
                token.backendToken = user.backendToken
                token.accountData = user.accountData
            }
            return token
        },
        async session({ session, token }) {
            // Pass backend token to session so client can access it
            if (token.backendToken) {
                console.log("📋 Adding backend data to session")
                session.backendToken = token.backendToken
                session.accountData = token.accountData
            }
            return session
        },
    },
    pages: {
        signIn: "/login",
        error: "/login", // Redirect to login on error
    },
    events: {
        // This runs on client-side after successful sign in
        async signIn(message) {
            console.log("🎉 Client-side signIn event triggered")
        },
    },
    debug: process.env.NODE_ENV === "development",
})

export { handler as GET, handler as POST }
