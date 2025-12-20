"use client"

import { usePathname, useRouter } from "next/navigation"
import EventHeader from "./containers/EventHeader"
import NavEvent from "./containers/NavEvent"
import { cn } from "@/lib/utils"
import { useGetDetailEvent } from "@/lib/queries/events"
import {
    Toast,
    ToastProvider,
    ToastTitle,
    ToastViewport,
} from "@/components/ui/toast"
import { LoaderCircle } from "lucide-react"
import { useEffect } from "react"

interface EventLayoutProps {
    children: React.ReactNode
    params: { slug: string }
}

const EventLayout = ({ children, params }: EventLayoutProps) => {
    const router = useRouter()
    const { slug } = params
    const pathname = usePathname()

    const isInQuizSection =
        pathname.includes("/start/") && pathname.split("/start/").length > 1

    const { isFetching, isError, data, isLoading } = useGetDetailEvent(slug)

    useEffect(() => {
        if ((isError || !isLoading) && !data) {
            router.push("/event/not-found")
        }
    }, [isError, isLoading, data, router])

    return (
        <main className="event-layout container text-foreground min-h-screen">
            <EventHeader slug={slug} />

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

            <ToastProvider>
                <Toast open={isFetching} variant="default">
                    <ToastTitle className="flex items-center gap-2">
                        <LoaderCircle
                            size={20}
                            className="inline-block animate-spin"
                        />
                        <span>Loading event details...</span>
                    </ToastTitle>
                </Toast>
                <ToastViewport />
            </ToastProvider>
        </main>
    )
}

export default EventLayout
