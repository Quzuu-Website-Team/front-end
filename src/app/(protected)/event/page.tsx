import EventList from "./containers/EventList"

export default function EventListPage() {
    return (
        <div className="container py-11 text-foreground">
            <h1 className="text-3xl font-bold mb-6">Event List</h1>
            <EventList />
        </div>
    )
}
