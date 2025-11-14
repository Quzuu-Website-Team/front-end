"use client"

import { useEffect } from "react"
import MaterialContent from "./containers/MaterialContent"
import MaterialHeader from "./containers/MaterialHeader"
import MaterialNav from "./containers/MaterialNav"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
    useGetAcademyMaterialDetail,
    useGetDetailAcademy,
} from "@/lib/queries/academy"
import AcademyMaterialError from "./containers/MaterialError"

export default function AcademyMaterial({
    params,
}: Readonly<{
    params: { slug: string }
}>) {
    const queryParams = useSearchParams()
    const pathname = usePathname()
    const router = useRouter()
    const {
        data: academyDetail,
        isLoading: isLoadingAcademy,
        isError: isErrorAcademy,
    } = useGetDetailAcademy(params.slug)
    const {
        data: materialDetail,
        isLoading: isLoadingMaterial,
        isError: isErrorMaterial,
    } = useGetAcademyMaterialDetail(
        params.slug,
        queryParams.get("material") || "",
    )

    useEffect(() => {
        if (
            !queryParams.get("material") &&
            academyDetail &&
            !isLoadingAcademy
        ) {
            router.push(
                `${pathname}?material=${academyDetail.materials[0].slug}`,
            )
        }
    }, [pathname, academyDetail, isLoadingAcademy, queryParams, router])

    if (isErrorAcademy) {
        return <AcademyMaterialError />
    }

    return (
        <div className="container py-11 flex flex-col gap-8">
            <MaterialHeader data={academyDetail} isLoading={isLoadingAcademy} />
            <div className="flex gap-6 flex-col md:grid md:grid-cols-3">
                <MaterialNav
                    data={academyDetail}
                    isLoading={isLoadingAcademy}
                />
                <MaterialContent
                    academyDetail={academyDetail}
                    academyMaterial={materialDetail}
                    isLoading={isLoadingAcademy || isLoadingMaterial}
                    isError={isErrorMaterial}
                />
            </div>
        </div>
    )
}
