"use client"

import AcademyCard from "@/components/academy/AcademyCard"
import AcademyCardSkeleton from "@/components/academy/AcademyCardSkeleton"
import { useGetListAcademy } from "@/lib/queries/academy"
import EmptyAcademyList from "./EmptyList"
import AcademyListError from "./AcademyListError"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useMemo, useState } from "react"
import EmptyMyAcademyList from "./EmptyMyAcademyList"
import GenericListView, { SortOption } from "@/components/list/GenericListView"
import { useListParams } from "@/hooks/use-list-params"

const sortOptions: SortOption[] = [
    {
        label: "Terbaru",
        value: { sortBy: "created_at", order: "desc" },
    },
    {
        label: "Terlama",
        value: { sortBy: "created_at", order: "asc" },
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

export default function AcademyList() {
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
        defaultSortBy: "created_at",
        defaultOrder: "desc",
    })

    const {
        data,
        isLoading: loadingListAcademy,
        isRefetching: refetchingListAcademy,
        isError,
    } = useGetListAcademy({
        page,
        search: search,
        sortBy,
        order: order as "asc" | "desc",
        registerStatus,
    })

    const [isInitialLoading, setIsInitialLoading] = useState(false)

    useEffect(() => {
        if (!loadingListAcademy && isInitialLoading) {
            setIsInitialLoading(false)
        }
    }, [loadingListAcademy, isInitialLoading])

    const listAcademy = useMemo(() => data?.data || [], [data])

    const handleSortChange = (newSortBy: string, newOrder: "asc" | "desc") => {
        setSortAndOrder(newSortBy, newOrder)
    }

    // Loading skeleton
    const loadingSkeleton = (
        <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                    <AcademyCardSkeleton key={`academy-skeleton-${index}`} />
                ))}
            </div>
        </div>
    )

    // Academy grid content
    const academyGrid = (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listAcademy.map((academy) => (
                <AcademyCard key={academy.id} academy={academy} />
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
                <TabsTrigger value="">All Available</TabsTrigger>
                <TabsTrigger value="1">My Academies</TabsTrigger>
            </TabsList>
        </Tabs>
    )

    // Determine empty state
    const getEmptyState = () => {
        if (isError) return <AcademyListError />
        if (!listAcademy?.length && registerStatus === "1")
            return <EmptyMyAcademyList />
        if (!listAcademy?.length) return <EmptyAcademyList />
        return null
    }

    return (
        <GenericListView
            searchValue={search}
            onSearchChange={setSearch}
            searchPlaceholder="Search academies..."
            sortOptions={sortOptions}
            currentSortBy={sortBy}
            currentOrder={order as "asc" | "desc"}
            onSortChange={handleSortChange}
            currentPage={data?.currentPage || 1}
            totalPages={data?.totalPages || 1}
            onPageChange={setPage}
            isLoading={loadingListAcademy || refetchingListAcademy}
            isInitialLoading={isInitialLoading}
            isEmpty={!listAcademy?.length || isError}
            emptyState={getEmptyState()}
            additionalFilters={tabsFilter}
        >
            {loadingListAcademy || refetchingListAcademy
                ? loadingSkeleton
                : academyGrid}
        </GenericListView>
    )
}
