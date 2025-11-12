"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavbarMenu() {
    const menus = [
        { title: "Home", path: "/" },
        { title: "Event", path: "/event" },
        { title: "Learn", path: "/learn" },
        { title: "Leaderboard", path: "/leaderboard" },
    ]

    const pathname = usePathname()

    const isActiveMenu = (path: string) => {
        if (path === "/") {
            return pathname === "/"
        }
        return pathname.startsWith(path)
    }

    return (
        <ul className="max-md:w-full max-md:px-8 flex flex-col md:flex-row justify-center md:justify-end items-center gap-5 md:flex md:gap-0 md:bg-white rounded-full">
            {menus.map((item, idx) => (
                <li key={idx}>
                    <Link
                        className={cn(
                            "md:h-12 max-md:w-full flex items-center justify-center text-foreground py-2 px-4 lg:px-6 xl:px-8 rounded-full transition-all cursor-pointer",
                            isActiveMenu(item.path)
                                ? "text-white bg-primary-500 font-medium"
                                : "hover:bg-primary-50",
                        )}
                        href={item.path}
                    >
                        {item.title}
                    </Link>
                </li>
            ))}
        </ul>
    )
}
