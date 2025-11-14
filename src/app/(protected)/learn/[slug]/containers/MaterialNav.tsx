"use client"

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { AcademyDetail } from "@/types/academy"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import React from "react"

export default function MaterialNav({
    data,
    isLoading,
}: {
    data?: AcademyDetail
    isLoading: boolean
}) {
    const queryParams = useSearchParams()

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
                            {data?.materials.map((material, index) => {
                                const isActive = queryParams
                                    .get("material")
                                    ?.includes(material.slug)
                                return (
                                    <Link
                                        key={material.id}
                                        href={`/learn/${data?.academy.slug}?material=${material.slug}`}
                                        className={cn(
                                            "flex items-center gap-3 px-4 py-2 rounded-lg border border-transparent hover:bg-primary-50 transition-all text-foreground",
                                            isActive &&
                                                "bg-primary-50 text-primary border-primary font-semibold",
                                        )}
                                    >
                                        <span
                                            className={cn(
                                                "text-sm rounded-full border-2 border-gray-300 font-semibold h-7 w-7 flex items-center justify-center text-gray-500",
                                                isActive &&
                                                    "text-primary border-primary",
                                            )}
                                        >
                                            {index + 1}
                                        </span>
                                        <span className="inline-block flex-1">
                                            {material.title}
                                        </span>
                                    </Link>
                                )
                            })}
                        </CardContent>
                    </AccordionContent>
                </Card>
            </AccordionItem>
        </Accordion>
    )
}
