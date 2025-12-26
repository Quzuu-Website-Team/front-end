"use client"

import { EventCard } from "@/components/events/EventCard"
import { EventCardSkeleton } from "@/components/events/EventCardSkeleton"
import { useGetListEvent } from "@/lib/queries/events"
import EmptyEventList from "./EmptyEventList"
import GenericListView, { SortOption } from "@/components/list/GenericListView"
import { useListParams } from "@/hooks/use-list-params"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useMemo, useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const sortOptions: SortOption[] = [
    {
        label: "Newest",
        value: { sortBy: "start_event", order: "desc" },
    },
    {
        label: "Oldest",
        value: { sortBy: "start_event", order: "asc" },
    },
    {
        label: "Title A-Z",
        value: { sortBy: "title", order: "asc" },
    },
    {
        label: "Title Z-A",
        value: { sortBy: "title", order: "desc" },
    },
]

const eventStatusOptions = [
    { label: "All Status", value: undefined },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "Ongoing", value: "ONGOING" },
    { label: "Ended", value: "ENDED" },
]

export default function EventList() {
    const {
        page,
        search,
        sort: sortBy,
        order,
        eventStatus,
        setEventStatus,
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
        isRefetching: refetchingListEvent,
        isError,
    } = useGetListEvent({
        page,
        search,
        sortBy,
        order: order as "asc" | "desc",
        registerStatus,
        eventStatus,
    })

    const [isInitialLoading, setIsInitialLoading] = useState(true)

    useEffect(() => {
        if (!loadingListEvent && isInitialLoading) {
            setIsInitialLoading(false)
        }
    }, [loadingListEvent, isInitialLoading])

    const listEvent = useMemo(() => data?.data || [], [data])

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

    const currentEventStatus = useMemo(
        () =>
            eventStatusOptions.find((opt) => opt.value === eventStatus) ||
            eventStatusOptions[0],
        [eventStatus],
    )

    const handleEventStatusChange = (value: string) => {
        const selectedOption = eventStatusOptions.find(
            (opt) => opt.value === value,
        )
        if (selectedOption) {
            setEventStatus(selectedOption.value!!)
        }
    }

    // Tabs for filtering
    const eventFilters = (
        <>
            <Select
                value={currentEventStatus.value}
                onValueChange={handleEventStatusChange}
                name="eventStatus"
            >
                <SelectTrigger
                    value={currentEventStatus.value}
                    className="bg-white sm:min-w-40 max-sm:w-full sm:w-fit"
                >
                    <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                    {eventStatusOptions.map((option) => (
                        <SelectItem
                            key={option.label}
                            value={option.value as string}
                        >
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Tabs
                defaultValue="all"
                value={registerStatus}
                onValueChange={setRegisterStatus}
            >
                <TabsList className="bg-slate-200">
                    <TabsTrigger value="">All Events</TabsTrigger>
                    <TabsTrigger value="1">My Events</TabsTrigger>
                </TabsList>
            </Tabs>
        </>
    )

    if (isError) {
        return <div>Terjadi kesalahan saat memuat data.</div>
    }

    return (
        <>
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
                isLoading={loadingListEvent || refetchingListEvent}
                isInitialLoading={isInitialLoading}
                isEmpty={!listEvent?.length}
                emptyState={<EmptyEventList />}
                additionalFilters={eventFilters}
            >
                {loadingListEvent || refetchingListEvent
                    ? loadingSkeleton
                    : eventGrid}
            </GenericListView>
        </>
    )
}
