"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { Academy } from "@/types/academy"
import { CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React, { useMemo } from "react"

export default function MaterialNav({
    data,
    isLoading,
}: {
    data?: Academy
    isLoading: boolean
}) {
    const queryParams = useSearchParams()

    const activeMaterialSlug = useMemo(() => {
        return queryParams.get("material") || ""
    }, [queryParams])

    if (isLoading) {
        return (
            <Card className="sticky">
                <CardHeader>
                    <CardTitle>Daftar Materi</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-2">
                    {Array(4)
                        .fill(null)
                        .map((_, index) => {
                            return (
                                <div
                                    key={index}
                                    className="h-11 w-full bg-gray-200 rounded-lg animate-pulse"
                                ></div>
                            )
                        })}
                </CardContent>
            </Card>
        )
    }

    return (
        <Accordion type="single" collapsible defaultValue="materials">
            <AccordionItem value="materials" className="w-full border-b-0">
                <Card className="p-0">
                    <AccordionTrigger className="pr-6">
                        <CardHeader className="w-fit max-sm:py-2">
                            <CardTitle>Daftar Materi</CardTitle>
                        </CardHeader>
                    </AccordionTrigger>
                    <AccordionContent>
                        <CardContent className="flex flex-col gap-2">
                            <div className="flex flex-col mb-4">
                                <div className="flex justify-between items-center">
                                    <p>Progress</p>
                                    <p>
                                        {data?.academy_progresses?.progress ||
                                            0}
                                        %
                                    </p>
                                </div>
                                <Progress
                                    value={
                                        data?.academy_progresses?.progress || 0
                                    }
                                    className="w-full mt-1"
                                />
                            </div>
                            <Accordion
                                dir="ltr"
                                type="multiple"
                                defaultValue={[activeMaterialSlug]}
                                key={activeMaterialSlug}
                            >
                                {data?.data.map((material) => {
                                    const isActiveMaterial =
                                        activeMaterialSlug === material.slug
                                    return (
                                        <AccordionItem
                                            value={material.slug}
                                            key={material.slug}
                                        >
                                            <AccordionTrigger
                                                className={cn(
                                                    isActiveMaterial
                                                        ? "underline"
                                                        : "",
                                                )}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {material
                                                        .academy_material_progresses
                                                        ?.status ===
                                                        "FINISHED" && (
                                                        <CheckCircle2
                                                            size={16}
                                                            className="text-green-700"
                                                        />
                                                    )}
                                                    <span>
                                                        {material.title}
                                                    </span>
                                                </div>
                                            </AccordionTrigger>
                                            <AccordionContent className="gap-1">
                                                {material.contents?.map(
                                                    (content) => {
                                                        const isActiveContent =
                                                            queryParams.get(
                                                                "content",
                                                            ) ==
                                                                content.order.toString() &&
                                                            isActiveMaterial
                                                        return (
                                                            <Link
                                                                key={content.id}
                                                                href={`/learn/${data?.slug}?material=${material.slug}&content=${content.order}`}
                                                                className={cn(
                                                                    "flex items-center gap-3 px-4 py-2 rounded-lg border border-transparent hover:bg-primary-50 transition-all text-foreground",
                                                                    isActiveContent &&
                                                                        "text-primary font-semibold",
                                                                )}
                                                            >
                                                                <span
                                                                    className={cn(
                                                                        "text-sm rounded-full border-2 border-gray-300 font-semibold h-7 w-7 flex items-center justify-center text-gray-500",
                                                                        isActiveContent &&
                                                                            "text-primary border-primary",
                                                                    )}
                                                                >
                                                                    {
                                                                        content.order
                                                                    }
                                                                </span>
                                                                <span className="inline-block flex-1">
                                                                    {
                                                                        material.title
                                                                    }
                                                                </span>
                                                                {content
                                                                    .academy_content_progresses
                                                                    ?.status ===
                                                                    "FINISHED" && (
                                                                    <CheckCircle2
                                                                        size={
                                                                            18
                                                                        }
                                                                        className="text-green-700"
                                                                    />
                                                                )}
                                                                {content
                                                                    .academy_content_progresses
                                                                    ?.status ===
                                                                    "IN_PROGRESS" && (
                                                                    <div className="h-2 w-2 mx-1 bg-slate-400 rounded-full"></div>
                                                                )}
                                                            </Link>
                                                        )
                                                    },
                                                )}
                                            </AccordionContent>
                                        </AccordionItem>
                                    )
                                })}
                            </Accordion>
                        </CardContent>
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>
    )
}
