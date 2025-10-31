"use client"

import { usePathname } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import EventHeader from "./containers/EventHeader"
import NavEvent from "./containers/NavEvent"
import { cn } from "@/lib/utils"

interface EventLayoutProps {
    children: React.ReactNode
    params: { id: string }
}

const EventLayout = ({ children, params }: EventLayoutProps) => {
    const pathname = usePathname()
    // TODO: Fetch event data based on params.id
    const eventTitle = "Try Out OSNK Informatika 2023"
    const eventSubtitle = "Event Details"

    // Check if we're in a quiz section (start/[slug])
    const isInQuizSection =
        pathname.includes("/start/") && pathname.split("/start/").length > 1
    const backUrl = `/event-details/${params.id}/start`

    return (
        <main className="event-layout container text-foreground min-h-screen">
            <EventHeader title={eventTitle} subtitle={eventSubtitle} />

            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                {!isInQuizSection && <NavEvent />}
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
