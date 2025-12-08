"use client"

import { useMemo } from "react"
import MaterialContent from "./containers/MaterialContent"
import MaterialHeader from "./containers/MaterialHeader"
import MaterialNav from "./containers/MaterialNav"
import { useSearchParams } from "next/navigation"
import {
    useGetAcademyMaterialContent,
    useGetAcademyMaterials,
    usePostMarkContentAsRead,
} from "@/lib/queries/academy"
import AcademyMaterialError from "./containers/MaterialError"

export default function AcademyMaterial({
    params,
}: Readonly<{
    params: { slug: string }
}>) {
    const queryParams = useSearchParams()
    const {
        data: academyDetail,
        isLoading: isLoadingAcademy,
        isRefetching: isRefetchingAcademy,
        isError: isErrorAcademy,
    } = useGetAcademyMaterials(params.slug)

    const enableMaterialContentQuery = useMemo(
        () =>
            !!(
                academyDetail &&
                queryParams.get("material") &&
                queryParams.get("content")
            ),
        [academyDetail, queryParams],
    )

    const {
        data: materialContent,
        isLoading: isLoadingMaterialContent,
        isError: isErrorMaterialContent,
    } = useGetAcademyMaterialContent(
        params.slug,
        queryParams.get("material") || "",
        Number(queryParams.get("content") || "1"),
        enableMaterialContentQuery,
    )

    const markAsReadMutation = usePostMarkContentAsRead(
        params.slug,
        queryParams.get("material") || "",
        Number(queryParams.get("content") || "1"),
    )

    if (isErrorAcademy) {
        return <AcademyMaterialError />
    }

    return (
        <div className="container py-11 flex flex-col gap-8">
            <MaterialHeader
                data={academyDetail}
                isLoading={isLoadingAcademy || isRefetchingAcademy}
            />
            <div className="flex gap-6 flex-col md:grid md:grid-cols-3">
                <MaterialNav
                    data={academyDetail}
                    isLoading={isLoadingAcademy || isRefetchingAcademy}
                />
                <MaterialContent
                    academyDetail={academyDetail}
                    academyMaterialContent={materialContent}
                    isLoading={
                        isLoadingAcademy ||
                        isRefetchingAcademy ||
                        isLoadingMaterialContent
                    }
                    isError={isErrorMaterialContent}
                    markAsReadMutation={markAsReadMutation}
                />
            </div>
        </div>
    )
}
