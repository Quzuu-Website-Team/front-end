"use client"

import { EventCard } from "@/components/events/EventCard"
import { EventCardSkeleton } from "@/components/events/EventCardSkeleton"
import { useGetListEvent } from "@/lib/queries/events"
import EmptyEventList from "./EmptyEventList"
import GenericListView, { SortOption } from "@/components/list/GenericListView"
import { useListParams } from "@/hooks/use-list-params"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const sortOptions: SortOption[] = [
    {
        label: "Terbaru",
        value: { sortBy: "start_event", order: "desc" },
    },
    {
        label: "Terlama",
        value: { sortBy: "start_event", order: "asc" },
    },
    {
        label: "Judul A-Z",
        value: { sortBy: "title", order: "asc" },
    },
    {
        label: "Judul Z-A",
        value: { sortBy: "title", order: "desc" },
    },
]

export default function EventList() {
    const {
        page,
        search,
        sort: sortBy,
        order,
        setSearch,
        setSortAndOrder,
        setPage,
        registerStatus,
        setRegisterStatus,
    } = useListParams({
        defaultSortBy: "start_event",
        defaultOrder: "desc",
    })

    const {
        data,
        isLoading: loadingListEvent,
        isError,
    } = useGetListEvent({
        page,
        search: search,
        sortBy,
        order: order as "asc" | "desc",
        registerStatus,
    })

    const listEvent = data?.data

    const handleSortChange = (newSortBy: string, newOrder: "asc" | "desc") => {
        setSortAndOrder(newSortBy, newOrder)
    }

    // Loading skeleton
    const loadingSkeleton = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
                <EventCardSkeleton key={`event-skeleton-${index}`} />
            ))}
        </div>
    )

    // Event grid content
    const eventGrid = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listEvent?.map((event) => (
                <EventCard key={event.id_event} event={event} />
            ))}
        </div>
    )

    // Tabs for filtering
    const tabsFilter = (
        <Tabs
            defaultValue="all"
            value={registerStatus}
            onValueChange={setRegisterStatus}
        >
            <TabsList className="bg-slate-200">
                <TabsTrigger value="">All Events</TabsTrigger>
                <TabsTrigger value="True">My Events</TabsTrigger>
            </TabsList>
        </Tabs>
    )

    if (isError) {
        return <div>Terjadi kesalahan saat memuat data.</div>
    }

    return (
        <GenericListView
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search events..."
            sortOptions={sortOptions}
            currentSortBy={sortBy}
            currentOrder={order as "asc" | "desc"}
            onSortChange={handleSortChange}
            currentPage={data?.currentPage || 1}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
            isLoading={loadingListEvent}
            isEmpty={!listEvent?.length}
            emptyState={<EmptyEventList />}
            additionalFilters={tabsFilter}
        >
            {loadingListEvent ? loadingSkeleton : eventGrid}
        </GenericListView>
    )
}
