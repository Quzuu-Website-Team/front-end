import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Academy } from "@/types/academy"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useMemo } from "react"

export default function MaterialContentFooter({
    academyDetail,
    isLoading,
    contentOrder,
}: {
    academyDetail?: Academy
    isLoading: boolean
    contentOrder: number
}) {
    const queryParams = useSearchParams()
    const materialSlug = useMemo(
        () => queryParams.get("material") || "",
        [queryParams],
    )

    const currentMaterialIndex = useMemo(() => {
        if (isLoading || !academyDetail) return -1

        return academyDetail.data.findIndex(
            (material) => material.slug === materialSlug,
        )
    }, [isLoading, academyDetail, materialSlug])

    const prevUrl = useMemo(() => {
        if (isLoading || !academyDetail || currentMaterialIndex === -1)
            return null

        const currentMaterial = academyDetail.data[currentMaterialIndex]

        // If not at first content of current material, go to previous content
        if (contentOrder > 1) {
            return `/learn/${academyDetail.slug}?material=${currentMaterial.slug}&content=${contentOrder - 1}`
        }

        // If at first content but not at first material, go to last content of previous material
        if (currentMaterialIndex > 0) {
            const prevMaterial = academyDetail.data[currentMaterialIndex - 1]
            return `/learn/${academyDetail.slug}?material=${prevMaterial.slug}&content=${prevMaterial.contents_count}`
        }

        // At first content of first material - no previous
        return null
    }, [isLoading, academyDetail, currentMaterialIndex, contentOrder])

    const nextUrl = useMemo(() => {
        if (isLoading || !academyDetail || currentMaterialIndex === -1)
            return null

        const currentMaterial = academyDetail.data[currentMaterialIndex]

        // If not at last content of current material, go to next content
        if (contentOrder < currentMaterial.contents_count) {
            return `/learn/${academyDetail.slug}?material=${currentMaterial.slug}&content=${contentOrder + 1}`
        }

        // If at last content but not at last material, go to first content of next material
        if (currentMaterialIndex < academyDetail.data.length - 1) {
            const nextMaterial = academyDetail.data[currentMaterialIndex + 1]
            return `/learn/${academyDetail.slug}?material=${nextMaterial.slug}&content=1`
        }

        // At last content of last material - no next
        return null
    }, [isLoading, academyDetail, currentMaterialIndex, contentOrder])

    if (isLoading) {
        return (
            <CardFooter className="flex justify-between">
                <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-full animate-pulse"></div>
            </CardFooter>
        )
    }

    return (
        <CardFooter className="flex justify-between">
            {prevUrl ? (
                <Link href={prevUrl}>
                    <Button className="flex items-center gap-2" variant="ghost">
                        <ChevronLeft size={18} />
                        <p>Sebelumnya</p>
                    </Button>
                </Link>
            ) : (
                <div></div>
            )}
            {nextUrl && (
                <Link href={nextUrl}>
                    <Button className="flex items-center gap-2">
                        <p>Selanjutnya</p>
                        <ChevronRight size={18} />
                    </Button>
                </Link>
            )}
        </CardFooter>
    )
}
