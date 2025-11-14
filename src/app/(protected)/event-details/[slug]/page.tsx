"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetDetailEvent } from "@/lib/queries/events"
import DOMPurify from "isomorphic-dompurify"
import Image from "next/image"
import { useMemo } from "react"
import RegisterEvent from "./containers/RegisterEvent"
import { CalendarCheck, CalendarOff } from "lucide-react"
import { formatDateTime } from "@/lib/utils/date-utils"

const EventOverview = ({ params }: { params: { slug: string } }) => {
    const { data: eventDetail, isLoading: loadingDetailEvent } =
        useGetDetailEvent(params.slug)

    const formattedStartDate = useMemo(
        () =>
            eventDetail?.start_event
                ? formatDateTime(eventDetail?.start_event)
                : "",
        [eventDetail],
    )
    const formattedEndDate = useMemo(
        () =>
            eventDetail?.end_event
                ? formatDateTime(eventDetail?.end_event)
                : "",
        [eventDetail],
    )

    const cleanHtml = useMemo(() => {
        if (!eventDetail?.overview) return ""
        return DOMPurify.sanitize(eventDetail.overview)
    }, [eventDetail])

    if (loadingDetailEvent || !eventDetail) {
        return (
            <Card className="text-slate-800">
                <CardHeader>
                    <CardTitle>
                        <div className="h-8 w-60 bg-gray-200 rounded-full animate-pulse"></div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <div className="h-6 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-6 w-2/3 bg-gray-200 rounded-full animate-pulse"></div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="text-slate-800 h-full">
            <CardHeader>
                <CardTitle>Event Overview</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid lg:grid-cols-2">
                    <div className="flex items-center gap-2 text-base text-slate-500">
                        <CalendarCheck className="h-4 w-4 flex-shrink-0" />
                        <span>Start Date:</span>
                        <span className="truncate">{formattedStartDate}</span>
                    </div>

                    <div className="flex items-center gap-2 text-base text-slate-500">
                        <CalendarOff className="h-4 w-4 flex-shrink-0" />
                        <span>End Date:</span>
                        <span className="truncate">{formattedEndDate}</span>
                    </div>
                </div>
                {eventDetail.overview ? (
                    <div
                        className="prose prose-slate"
                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                        <Image
                            height={160}
                            width={160}
                            alt="No overview"
                            src="/assets/img/question-text.svg"
                        />
                        <p className="text-lg text-gray-500">
                            No overview available for this event.
                        </p>
                    </div>
                )}

                <RegisterEvent slug={params.slug} />
            </CardContent>
        </Card>
    )
}

export default EventOverview
