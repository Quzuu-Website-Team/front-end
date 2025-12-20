"use client"

import React, { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation"
import { loginUser } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"

import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import Link from "next/link"
import GoogleSignInButton from "@/components/GoogleSignInButton"

const FormSchema = z.object({
    email_or_username: z.string().min(3, {
        message: "Email or Username must be at least 3 characters.",
    }),
    password: z.string().min(7, {
        message: "Password must be at least 7 characters.",
    }),
})

const Login = () => {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")
    const { refreshUserData } = useAuth()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email_or_username: "",
            password: "",
        },
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        setLoading(true)
        setErrorMessage("")

        try {
            console.log("Attempting login with:", {
                email_or_username: data.email_or_username,
            })

            const response = await loginUser(
                data.email_or_username,
                data.password,
            )
            console.log("Login response:", response)

            await refreshUserData()

            toast({
                title: "Login successful",
                description: "Welcome back to Quzuu!",
            })

            if (
                response.account &&
                response.account.is_email_verified === false
            ) {
                router.push(
                    `/verify-email?email=${encodeURIComponent(response.account.email)}`,
                )
                return
            }

            if (
                response.account &&
                response.account.is_detail_completed === false
            ) {
                router.push("/complete-profile")
                return
            }

            router.push("/")
        } catch (error: any) {
            console.error("Login error:", error)

            setErrorMessage(
                error.message || "Failed to login. Please try again.",
            )

            toast({
                variant: "destructive",
                title: "Login failed",
                description:
                    error.message ||
                    "Failed to login. Please check your credentials.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="login-page w-screen min-h-screen bg-white grid grid-cols-1 md:grid-cols-2 gap-x-6">
            <section className="input-login p-8 flex flex-col items-center justify-center">
                <div className="logo-wrapper w-36">
                    <Image
                        src="/assets/img/quzzulogo.png"
                        alt="Logo Quzzu"
                        layout="responsive"
                        width={100}
                        height={94}
                    />
                </div>
                <h1 className="text-2xl font-semibold mb-2">
                    Welcome back to Quzuu
                </h1>
                <p className="text-slate-500 mb-8 text-center">
                    Enter your email/username and password to continue.
                </p>

                {/* Google Sign-In Button */}
                <div className="sm:w-2/3 w-full mb-6">
                    <GoogleSignInButton disabled={loading} />
                </div>

                {/* Divider */}
                <div className="sm:w-2/3 w-full flex items-center mb-6">
                    <div className="flex-1 border-t border-gray-300"></div>
                    <span className="px-4 text-gray-500 text-sm">or</span>
                    <div className="flex-1 border-t border-gray-300"></div>
                </div>

                {/* Email/Password Form */}
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="sm:w-2/3 w-full space-y-6"
                    >
                        <FormField
                            control={form.control}
                            name="email_or_username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email or Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input your email or username"
                                            type="text"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)

                                                // Clear error message on input change
                                                if (errorMessage)
                                                    setErrorMessage("")
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Input your password"
                                            type="password"
                                            {...field}
                                            onChange={(e) => {
                                                field.onChange(e)

                                                // Clear error message on input change
                                                if (errorMessage)
                                                    setErrorMessage("")
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                    <div className="lupa-password flex justify-end">
                                        <Button variant="link">
                                            <Link href="/forgot-password">
                                                Forgot Password
                                            </Link>
                                        </Button>
                                    </div>
                                </FormItem>
                            )}
                        />
                        {/* Error Message Display */}
                        {errorMessage && (
                            <div className="text-red-500 text-sm text-center p-3 bg-red-50 rounded-md border border-red-200">
                                {errorMessage}
                            </div>
                        )}
                        <Button
                            type="submit"
                            className="w-full mt-14"
                            disabled={loading}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                </Form>
                <p className="mt-8">
                    Belum punya akun?{" "}
                    <Link
                        href="/register"
                        className="text-base text-primary hover:underline transition-all"
                    >
                        Klik di sini
                    </Link>
                </p>
            </section>
            <section className="image-login p-4 hidden md:flex">
                <Image
                    src="/assets/img/background-auth.jpg"
                    alt="Image Login"
                    layout="responsive"
                    width={500}
                    height={800}
                    className="object-cover rounded-xl"
                />
            </section>
        </div>
    )
}

export default Login
