"use client"

import EventList from "./containers/EventList"
import RegisterPrivateEvent from "./containers/RegisterPrivateEvent"

export default function EventListPage() {
    return (
        <div className="container py-11 text-foreground flex flex-col gap-6">
            <div className="flex justify-between gap-4 flex-wrap items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">Explore All Events</h1>
                    <p className="text-muted-foreground text-base">
                        Browse all scheduled events, and join the quizzes now!.
                    </p>
                </div>
                <RegisterPrivateEvent />
            </div>
            <EventList />
        </div>
    )
}
