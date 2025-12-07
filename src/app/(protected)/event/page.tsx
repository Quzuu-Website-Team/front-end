import EventList from "./containers/EventList"

export default function EventListPage() {
    return (
        <div className="container py-11 text-foreground flex flex-col gap-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">Explore All Events</h1>
                <p className="text-muted-foreground text-base">
                    Browse all scheduled events, and join the quizzes now!.
                </p>
            </div>
            <EventList />
        </div>
    )
}
