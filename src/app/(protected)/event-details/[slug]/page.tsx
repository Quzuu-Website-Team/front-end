"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useGetDetailEvent } from "@/lib/queries/events"
import DOMPurify from "isomorphic-dompurify"
import Image from "next/image"
import { useMemo } from "react"
import RegisterEvent from "./containers/RegisterEvent"

const EventOverview = ({ params }: { params: { slug: string } }) => {
    const { data: eventDetail, isLoading: loadingDetailEvent } =
        useGetDetailEvent(params.slug)

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
        <Card className="text-slate-800">
            <CardHeader>
                <CardTitle>Event Overview</CardTitle>
            </CardHeader>
            <CardContent>
                {eventDetail.overview ? (
                    <div
                        className="prose prose-slate"
                        dangerouslySetInnerHTML={{ __html: cleanHtml }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                        <Image
                            height={200}
                            width={200}
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
