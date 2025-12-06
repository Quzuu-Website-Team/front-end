import { Button } from "@/components/ui/button"
import { CardFooter } from "@/components/ui/card"
import { Academy } from "@/types/academy"
import { UseMutateFunction } from "@tanstack/react-query"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import React, { useCallback, useMemo } from "react"
import { toast } from "@/hooks/use-toast"

interface MaterialContentFooterProps {
    academyDetail?: Academy
    isLoading: boolean
    contentOrder: number
    nextIsLoading?: boolean
    onNext: UseMutateFunction
}

export default function MaterialContentFooter({
    academyDetail,
    isLoading,
    contentOrder,
    nextIsLoading,
    onNext,
}: MaterialContentFooterProps) {
    const queryParams = useSearchParams()
    const materialSlug = useMemo(
        () => queryParams.get("material") || "",
        [queryParams],
    )

    const currentMaterialIndex = useMemo(() => {
        if (isLoading || !academyDetail || !academyDetail.materials) return -1

        return academyDetail.materials.findIndex(
            (material) => material.slug === materialSlug,
        )
    }, [isLoading, academyDetail, materialSlug])

    const prevUrl = useMemo(() => {
        if (
            isLoading ||
            !academyDetail ||
            !academyDetail.materials ||
            currentMaterialIndex === -1
        )
            return null

        const currentMaterial = academyDetail.materials[currentMaterialIndex]

        // If not at first content of current material, go to previous content
        if (contentOrder > 1) {
            return `/learn/${academyDetail.slug}?material=${currentMaterial.slug}&content=${contentOrder - 1}`
        }

        // If at first content but not at first material, go to last content of previous material
        if (currentMaterialIndex > 0) {
            const prevMaterial =
                academyDetail.materials[currentMaterialIndex - 1]
            return `/learn/${academyDetail.slug}?material=${prevMaterial.slug}&content=${prevMaterial.contents_count}`
        }

        // At first content of first material - no previous
        return null
    }, [isLoading, academyDetail, currentMaterialIndex, contentOrder])

    const nextUrl = useMemo(() => {
        if (
            isLoading ||
            !academyDetail ||
            !academyDetail.materials ||
            currentMaterialIndex === -1
        )
            return null

        const currentMaterial = academyDetail.materials[currentMaterialIndex]

        // If not at last content of current material, go to next content
        if (contentOrder < currentMaterial.contents_count) {
            return `/learn/${academyDetail.slug}?material=${currentMaterial.slug}&content=${contentOrder + 1}`
        }

        // If at last content but not at last material, go to first content of next material
        if (currentMaterialIndex < academyDetail.materials.length - 1) {
            const nextMaterial =
                academyDetail.materials[currentMaterialIndex + 1]
            return `/learn/${academyDetail.slug}?material=${nextMaterial.slug}&content=1`
        }

        // At last content of last material - no next
        return null
    }, [isLoading, academyDetail, currentMaterialIndex, contentOrder])

    const router = useRouter()
    const handleNext = useCallback(() => {
        const currentMaterialContent = academyDetail?.materials?.[
            currentMaterialIndex
        ]?.contents?.find((content) => content.order === contentOrder)

        if (currentMaterialContent?.status === "FINISHED") {
            if (nextUrl) {
                router.push(nextUrl)
            }
        }

        // only mark as read if not finished
        onNext(undefined, {
            onSuccess: () => {
                toast({
                    title: "Success update progress",
                    description:
                        "You have successfully update your learning progress.",
                })
            },
            onError: (error) => {
                toast({
                    title: "Error",
                    description: `Failed to update progress: ${error.message}`,
                    variant: "destructive",
                })
            },
            onSettled: () => {
                if (nextUrl) {
                    router.push(nextUrl)
                }
            },
        })
    }, [
        nextUrl,
        router,
        onNext,
        academyDetail,
        currentMaterialIndex,
        contentOrder,
    ])

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
                <Button
                    className="flex items-center gap-2"
                    iconRight={<ChevronRight size={18} />}
                    isLoading={nextIsLoading}
                    onClick={handleNext}
                >
                    <p>Selanjutnya</p>
                </Button>
            )}
        </CardFooter>
    )
}
