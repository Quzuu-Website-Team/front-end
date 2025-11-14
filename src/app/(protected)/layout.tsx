import Navbar from "@/components/navbar/Navbar"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <main className="min-h-screen h-full">
            <Navbar />
            <div className="pt-20">{children}</div>
        </main>
    )
}
