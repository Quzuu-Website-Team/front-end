"use client"

import { usePathname } from "next/navigation"
import EventHeader from "./containers/EventHeader"
import NavEvent from "./containers/NavEvent"
import { cn } from "@/lib/utils"
import { use } from "react"

interface EventLayoutProps {
    children: React.ReactNode
    params: { slug: string }
}

const EventLayout = ({ children, params }: EventLayoutProps) => {
    const { slug } = params
    const pathname = usePathname()
    const eventTitle = "Try Out OSNK Informatika 2023"
    const eventSubtitle = "Event Details"

    const isInQuizSection =
        pathname.includes("/start/") && pathname.split("/start/").length > 1

    return (
        <main className="event-layout container text-foreground min-h-screen">
            <EventHeader title={eventTitle} subtitle={eventSubtitle} />

            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                {!isInQuizSection && <NavEvent slug={slug} />}
                <div
                    className={cn(
                        isInQuizSection ? "col-span-full" : "col-span-2",
                    )}
                >
                    {children}
                </div>
            </section>
        </main>
    )
}

export default EventLayout
