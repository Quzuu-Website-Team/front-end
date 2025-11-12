"use client"

import { Badge } from "@/components/ui/badge"
import { useGetDetailEvent } from "@/lib/queries/events"

interface EventHeaderProps {
    slug: string
}

const EventHeader: React.FC<EventHeaderProps> = ({ slug }) => {
    const { data: eventDetail, isLoading: loadingDetailEvent } =
        useGetDetailEvent(slug)

    if (loadingDetailEvent || !eventDetail) {
        return (
            <section className="head-info py-8 flex gap-4 flex-wrap items-center md:justify-between">
                <div className="h-8 w-1/3 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-8 w-40 bg-gray-200 rounded-full animate-pulse"></div>
            </section>
        )
    }
    return (
        <section className="head-info py-8 flex gap-4 flex-wrap items-center">
            <h1 className="text-2xl font-bold">{eventDetail.title}</h1>
            <Badge
                className="text-sm md:text-base md:px-4"
                variant={
                    eventDetail.register_status ? "success" : "destructive"
                }
            >
                {eventDetail.register_status ? "Registered" : "Not Registered"}
            </Badge>
        </section>
    )
}

export default EventHeader
