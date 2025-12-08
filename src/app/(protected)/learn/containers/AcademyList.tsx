"use client"

import AcademyCard from "@/components/academy/AcademyCard"
import AcademyCardSkeleton from "@/components/academy/AcademyCardSkeleton"
import { useGetListAcademy } from "@/lib/queries/academy"
import EmptyAcademyList from "./EmptyList"
import AcademyListError from "./AcademyListError"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCallback, useMemo, useState } from "react"
import EmptyMyAcademyList from "./EmptyMyAcademyList"

export default function AcademyList() {
    const {
        data: listAcademy,
        isLoading: loadingListAcademy,
        isRefetching: refetchingListAcademy,
        isError,
    } = useGetListAcademy()

    const [filter, setFilter] = useState<"all" | "my">("all")

    const filteredAcademy = useMemo(
        () =>
            listAcademy?.filter((academy) => {
                if (filter === "my") {
                    return !!academy.register_status
                }
                return true
            }) ?? [],
        [listAcademy, filter],
    )

    const renderList = useCallback(() => {
        if (isError) {
            return <AcademyListError />
        }

        if (!listAcademy?.length) {
            return <EmptyAcademyList />
        }

        if (!filteredAcademy?.length) {
            return <EmptyMyAcademyList />
        }

        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredAcademy.map((academy) => (
                    <AcademyCard key={academy.id} academy={academy} />
                ))}
            </div>
        )
    }, [isError, listAcademy, filteredAcademy])

    if (loadingListAcademy || refetchingListAcademy) {
        return (
            <div className="space-y-4">
                <div className="h-10 w-60 rounded-md bg-slate-200 mb-2 mx-auto"></div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <AcademyCardSkeleton
                            key={`academy-skeleton-${index}`}
                        />
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <Tabs
                defaultValue="all"
                className="flex justify-center"
                onValueChange={(value) => setFilter(value as "all" | "my")}
            >
                <TabsList className="bg-slate-200">
                    <TabsTrigger value="all">All Available</TabsTrigger>
                    <TabsTrigger value="my">My Academies</TabsTrigger>
                </TabsList>
            </Tabs>
            {renderList()}
        </div>
    )
}
