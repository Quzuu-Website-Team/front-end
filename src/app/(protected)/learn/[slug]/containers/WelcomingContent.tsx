"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { usePostJoinAcademy } from "@/lib/queries/academy"
import { Academy } from "@/types/academy"
import { ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

const fallbackImage = "/assets/img/academy-placeholder.svg"

export default function WelcomingContent({
    academyDetail,
}: {
    academyDetail: Academy
}) {
    const [imageSrc, setImageSrc] = useState(
        academyDetail.image_url || fallbackImage,
    )

    const joinAcademyMutation = usePostJoinAcademy()

    const continueUrl = useMemo(() => {
        if (!academyDetail.materials?.[0]?.slug) return "#"

        // search first in progress material content
        const inProgressMaterial = academyDetail.materials.find(
            (material) => material?.status !== "FINISHED",
        )

        if (inProgressMaterial && inProgressMaterial.contents) {
            const inProgressContentOrder =
                inProgressMaterial.contents?.find(
                    (content) => content.status !== "FINISHED",
                )?.order || 1
            return `/learn/${academyDetail.slug}?material=${inProgressMaterial.slug}&content=${inProgressContentOrder}`
        }

        return `/learn/${academyDetail.slug}?material=${academyDetail.materials[0].slug}&content=1`
    }, [academyDetail])

    const handleStartLearning = () => {
        joinAcademyMutation.mutate(academyDetail.code, {
            onSuccess: () => {
                toast({
                    title: "Successfully joined the academy!",
                    description: "You can now access the learning materials.",
                })
            },
            onError: () => {
                toast({
                    title: "Failed to join the academy",
                    description: "Please try again later.",
                    variant: "destructive",
                })
            },
        })
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>{academyDetail.title}</CardTitle>{" "}
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="relative w-full aspect-video md:w-3/4">
                        {/* Academy Image */}
                        <Image
                            src={imageSrc}
                            alt={academyDetail.slug || "academy image"}
                            onError={() => setImageSrc(fallbackImage)}
                            fill
                            loading="lazy"
                            unoptimized
                            className="object-cover rounded-lg"
                        />
                    </div>
                    <p className="md:text-lg text-gray-500 text-justify">
                        {academyDetail.description ||
                            "You need to register for this academy to access the material content."}
                    </p>
                    {academyDetail.register_status ? (
                        <Link className="w-full" href={continueUrl}>
                            <Button
                                className="w-full"
                                size="lg"
                                iconRight={<ChevronRight size={18} />}
                            >
                                Continue Learning
                            </Button>
                        </Link>
                    ) : (
                        <Button
                            className="w-full"
                            size="lg"
                            onClick={handleStartLearning}
                            isLoading={joinAcademyMutation.isPending}
                        >
                            Start Learning
                        </Button>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
