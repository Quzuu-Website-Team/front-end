"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavbarMenu() {
    const menus = [
        { title: "Home", path: "/" },
        { title: "Event", path: "/event" },
        { title: "Learn", path: "/learn" },
        { title: "Problemset", path: "/problemset" },
        { title: "Submission", path: "/submission" },
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
                <li
                    key={idx}
                    className={cn(
                        "md:h-12 max-md:w-full flex items-center justify-center text-foreground py-2 px-4 md:px-3 lg:px-4 xl:px-6 rounded-full transition-colors cursor-pointer",
                        isActiveMenu(item.path)
                            ? "text-white bg-primary-500"
                            : "hover:bg-primary-50",
                    )}
                >
                    <Link href={item.path}>{item.title}</Link>
                </li>
            ))}
        </ul>
    )
}
