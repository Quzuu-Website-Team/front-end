"use client"

import { useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useGetDetailEvent } from "@/lib/queries/events"
import { toast } from "@/hooks/use-toast"
import EventDetailSkeleton from "@/components/events/EventDetailSkeleton"

export default function PrivateEventLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter()
    const params = useParams()
    const eventSlug = params.slug as string

    const {
        data: event,
        isLoading,
        isError,
        error,
    } = useGetDetailEvent(eventSlug)

    useEffect(() => {
        if (isLoading) {
            return
        }

        if (isError) {
            console.error(error)
            toast({
                title: "Error",
                description:
                    "Error fetching event details, please try again later.",
            })
            router.push(`/events`)
            return
        }

        if (event && !event.register_status) {
            toast({
                title: "Access Denied",
                description:
                    "You are not registered for this event. Redirecting to event details page.",
            })
            router.push(`/event-details/${eventSlug}`)
        }
    }, [isLoading, isError, event, eventSlug, router, error])

    if (isLoading || !event || !event.register_status) {
        return <EventDetailSkeleton />
    }

    return <>{children}</>
}
