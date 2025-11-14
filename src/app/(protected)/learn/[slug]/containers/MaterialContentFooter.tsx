import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { AcademyDetail } from "@/types/academy"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useMemo } from "react"

export default function MaterialContentFooter({
    data,
    isLoading,
}: {
    data?: AcademyDetail
    isLoading: boolean
}) {
    const queryParams = useSearchParams()
    const materialSlug = useMemo(
        () => queryParams.get("material") || "",
        [queryParams],
    )

    const currentMaterialIndex = useMemo(() => {
        if (isLoading || !data) return -1

        return data.materials.findIndex(
            (material) => material.slug === materialSlug,
        )
    }, [isLoading, data, materialSlug])

    const prevSlug = useMemo(() => {
        if (isLoading || !data || currentMaterialIndex === -1) return null
        return data.materials[currentMaterialIndex - 1]?.slug
    }, [isLoading, data, currentMaterialIndex])

    const nextSlug = useMemo(() => {
        if (isLoading || !data || currentMaterialIndex === -1) return null

        return data.materials[currentMaterialIndex + 1]?.slug
    }, [isLoading, data, currentMaterialIndex])

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
            {prevSlug ? (
                <Link
                    href={`/learn/${data?.academy.slug}?material=${prevSlug}`}
                >
                    <Button className="flex items-center gap-2" variant="ghost">
                        <ChevronLeft size={18} />
                        <p>Sebelumnya</p>
                    </Button>
                </Link>
            ) : (
                <div></div>
            )}
            {nextSlug && (
                <Link
                    href={`/learn/${data?.academy.slug}?material=${nextSlug}`}
                >
                    <Button className="flex items-center gap-2">
                        <p>Selanjutnya</p>
                        <ChevronRight size={18} />
                    </Button>
                </Link>
            )}
        </CardFooter>
    )
}
