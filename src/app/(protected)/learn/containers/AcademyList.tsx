"use client"

import AcademyCard from "@/components/academy/AcademyCard"
import AcademyCardSkeleton from "@/components/academy/AcademyCardSkeleton"
import { useGetListAcademy } from "@/lib/queries/academy"
import EmptyAcademyList from "./EmptyList"
import AcademyListError from "./AcademyListError"

export default function AcademyList() {
    const {
        data: listAcademy,
        isLoading: loadingListAcademy,
        isError,
    } = useGetListAcademy()

    if (loadingListAcademy) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 6 }).map((_, index) => (
                    <AcademyCardSkeleton key={`academy-skeleton-${index}`} />
                ))}
            </div>
        )
    }

    if (isError) {
        return <AcademyListError />
    }

    if (!listAcademy?.length) {
        return <EmptyAcademyList />
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {listAcademy.map((academy) => (
                <AcademyCard key={academy.id} academy={academy} />
            ))}
        </div>
    )
}
