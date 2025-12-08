"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { useGetDetailEvent } from "@/lib/queries/events"
import { cn } from "@/lib/utils"
import { LockIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

const fallbackImage = "/assets/img/event-placeholder.svg"

const NavEvent = ({ slug }: { slug: string }) => {
    const pathname = usePathname()

    const { data: eventDetail, isLoading: loadingDetailEvent } =
        useGetDetailEvent(slug)

    const [imageSrc, setImageSrc] = useState(
        eventDetail?.img_banner || fallbackImage,
    )

    useEffect(() => {
        if (eventDetail?.img_banner) {
            setImageSrc(eventDetail.img_banner)
        }
    }, [eventDetail?.img_banner])

    const menuItems = useMemo(
        () => [
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
        ],
        [slug],
    )

    const isActive = useCallback(
        (href: string, exact?: boolean) => {
            if (exact) {
                return pathname === href
            }
            return pathname.startsWith(href)
        },
        [pathname],
    )

    if (loadingDetailEvent || !eventDetail) {
        return (
            <Card className="col-span-1 text-slate-800">
                <CardHeader>
                    <div className="h-40 w-full aspect-video bg-gray-200 rounded-lg animate-pulse"></div>
                </CardHeader>
                <CardContent className="menu-links w-full space-y-1">
                    {Array.from({ length: 4 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="h-8 w-full bg-gray-200 rounded-full animate-pulse"
                        ></div>
                    ))}
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-1 text-slate-800">
            <CardHeader>
                <Image
                    src={imageSrc}
                    alt={eventDetail.title}
                    onError={() => setImageSrc(fallbackImage)}
                    layout="responsive"
                    className="object-cover w-full aspect-video rounded-lg"
                    width={320}
                    height={180}
                    unoptimized
                />
            </CardHeader>
            <CardContent className="menu-links w-full space-y-1">
                {menuItems.map((item, index) => {
                    const active = isActive(item.href, item.exact)
                    return (
                        <Link
                            key={item.label}
                            href={eventDetail.register_status ? item.href : "#"}
                            className={cn(
                                "flex justify-between gap-2 w-full py-1.5 px-4 xl:px-12 rounded-full transition-colors",
                                active
                                    ? "bg-primary-50 text-primary border border-primary font-semibold"
                                    : item.highlight
                                      ? "text-primary font-semibold hover:bg-primary/10"
                                      : "hover:bg-primary-50 hover:text-primary",
                                index !== 0 &&
                                    !eventDetail.register_status &&
                                    "pointer-events-none opacity-50",
                            )}
                        >
                            <span>{item.label}</span>
                            {!eventDetail.register_status && index !== 0 && (
                                <LockIcon className="w-4 h-4 text-gray-400" />
                            )}
                        </Link>
                    )
                })}
            </CardContent>
        </Card>
    )
}

export default NavEvent
