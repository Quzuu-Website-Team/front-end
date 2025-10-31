import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar/Navbar"
import { Toaster } from "@/components/ui/toaster"
import { Providers } from "@/components/Providers"
import { cn } from "@/lib/utils"

const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-inter",
})

export const metadata: Metadata = {
    title: "Quzuu - Quiz Platform",
    description: "Empowering champions with Quzuu",
}

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
            <body className={cn(inter.className, "min-h-screen bg-background")}>
                <Providers>
                    {children}
                    <Toaster />
                </Providers>
            </body>
        </html>
    )
}
