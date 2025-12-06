import Link from "next/link"
import Image from "next/image"
import { BookText } from "lucide-react"
import type { Academy } from "@/types/academy"
import { useState } from "react"
import { Badge } from "../ui/badge"
import { mapAcademyStatus } from "@/lib/utils/academy-status"
import { Progress } from "../ui/progress"

interface AcademyCardProps {
    academy: Academy
}

const fallbackImage = "/assets/img/academy-placeholder.svg"

export default function AcademyCard({ academy }: AcademyCardProps) {
    const {
        title,
        slug,
        description,
        image_url,
        academy_progress,
        materials_count,
    } = academy

    const [imageSrc, setImageSrc] = useState(image_url || fallbackImage)

    const mappedStatus = mapAcademyStatus(
        academy_progress?.status || "NOT_STARTED",
    )
    return (
        <Link
            href={`/learn/${slug}`}
            className="group block overflow-hidden rounded-2xl border bg-card text-card-foreground shadow-sm transition-transform duration-300 ease-in-out hover:shadow-lg hover:-translate-y-1"
        >
            <div className="relative w-full aspect-video">
                {/* Academy Image */}
                <Image
                    src={imageSrc}
                    alt={title}
                    onError={() => setImageSrc(fallbackImage)}
                    fill
                    loading="lazy"
                    unoptimized
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
            </div>

            <div className="flex flex-col gap-4 p-4 text-gray-600">
                <div>
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {title}
                    </h3>
                    <p className="text-muted-foreground text-base line-clamp-1">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                        <p>Progress</p>
                        <p>{academy_progress?.progress || 0}%</p>
                    </div>
                    <Progress
                        value={academy_progress?.progress || 0}
                        className="w-full mt-1"
                    />
                </div>

                <div className="flex justify-between gap-4">
                    <div className="flex items-center gap-1">
                        <BookText size={20} />
                        <p>{materials_count} Materi</p>
                    </div>

                    <Badge variant={mappedStatus.variant} className="px-2 py-1">
                        {mappedStatus.label}
                    </Badge>
                </div>
            </div>
        </Link>
    )
}
