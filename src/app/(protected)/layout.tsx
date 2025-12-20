import Navbar from "@/components/navbar/Navbar"
import { Suspense } from "react"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="min-h-screen h-full">
            <Navbar />
            <Suspense>
                <div className="pt-20">{children}</div>
            </Suspense>
        </main>
    )
}
