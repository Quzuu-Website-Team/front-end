"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NavEvent = ({ slug }: { slug: string }) => {
    const pathname = usePathname()

    const menuItems = [
        {
            href: `/event-details/${slug}`,
            label: "Overview",
            exact: true,
        },
        {
            href: `/event-details/${slug}/start`,
            label: "Start The Quiz",
            highlight: true,
        },
        {
            href: `/event-details/${slug}/announcement`,
            label: "Announcement",
        },
        {
            href: `/event-details/${slug}/scoreboard`,
            label: "Scoreboard",
        },
    ]

    const isActive = (href: string, exact?: boolean) => {
        if (exact) {
            return pathname === href
        }
        return pathname.startsWith(href)
    }

    return (
        <Card className="col-span-1 text-slate-800">
            <CardHeader>
                <Image
                    src="/assets/img/promotor-TROC.png"
                    alt="TROC"
                    layout="responsive"
                    className="object-contain w-full h-auto rounded-lg"
                    width={300}
                    height={100}
                />
            </CardHeader>
            <CardContent className="menu-links w-full space-y-1">
                {menuItems.map((item) => {
                    const active = isActive(item.href, item.exact)
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "block w-full py-1.5 px-4 xl:px-12 rounded-full transition-colors",
                                active
                                    ? "bg-primary text-white"
                                    : item.highlight
                                      ? "text-primary font-semibold hover:bg-primary/10"
                                      : "hover:bg-primary-50 hover:text-primary",
                            )}
                        >
                            {item.label}
                        </Link>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default NavEvent
