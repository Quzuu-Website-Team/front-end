"use client"

import { EventCard } from "@/components/events/EventCard"
import { EventCardSkeleton } from "@/components/events/EventCardSkeleton"
import { useGetListEvent } from "@/lib/queries/events"

export default function EventList() {
    const {
        data: listEvent,
        isLoading: loadingListEvent,
        isError,
    } = useGetListEvent()

    if (loadingListEvent) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <EventCardSkeleton key={`event-skeleton-${index}`} />
                ))}
            </div>
        )
    }

    if (isError) {
        return <div>Terjadi kesalahan saat memuat data.</div>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listEvent?.map((event) => (
                <EventCard key={event.id_event} event={event} />
            ))}
        </div>
    )
}
