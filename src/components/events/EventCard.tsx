import Link from "next/link"
import Image from "next/image"
import { getEventStatus } from "@/lib/utils/event-status"
import { Badge } from "@/components/ui/badge"
import { CalendarCheck, CalendarOff } from "lucide-react"
import type { EventData } from "@/types/events"
import { useState } from "react"
import { formatDateTime } from "@/lib/utils/date-utils"

interface EventCardProps {
    event: EventData
}

const fallbackImage = "/assets/img/event-placeholder.svg"

export function EventCard({ event }: EventCardProps) {
    const { title, slug, img_banner, start_event, end_event } = event

    const eventStatus = getEventStatus(start_event, end_event)

    const formattedStartDate = formatDateTime(start_event)
    const formattedEndDate = formatDateTime(end_event)

    const [imageSrc, setImageSrc] = useState(img_banner || fallbackImage)

    return (
        <Link
            href={`/event-details/${slug}`}
            className="group block overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-transform duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
        >
            <div className="relative w-full aspect-video">
                {/* Event Image */}
                <Image
                    src={imageSrc}
                    alt={title}
                    onError={() => setImageSrc(fallbackImage)}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Status Badge (Overlay) */}
                <div className="absolute right-3 top-3">
                    <Badge variant={eventStatus.variant} className="text-sm">
                        {eventStatus.label}
                    </Badge>
                </div>
            </div>

            <div className="p-4">
                <h3 className="text-lg font-semibold tracking-tight">
                    {title}
                </h3>

                <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarCheck className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{formattedStartDate}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarOff className="mr-2 h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{formattedEndDate}</span>
                    </div>
                </div>
            </div>
        </Link>
    )
}
