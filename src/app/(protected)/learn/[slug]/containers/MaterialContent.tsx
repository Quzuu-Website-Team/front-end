"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useMemo } from "react"
import DOMPurify from "isomorphic-dompurify"
import MaterialContentFooter from "./MaterialContentFooter"
import MaterialContentLoading from "./MaterialContentLoading"
import { Academy, AcademyMaterialContent } from "@/types/academy"
import { BookX } from "lucide-react"

export default function MaterialContent({
    academyDetail,
    academyMaterialContent,
    isLoading,
    isError,
}: {
    academyDetail?: Academy
    academyMaterialContent?: AcademyMaterialContent
    isLoading: boolean
    isError: boolean
}) {
    const sanitizeContent = (content?: string) => {
        if (!content) return ""
        return DOMPurify.sanitize(content)
    }

    const academyMaterial = useMemo(
        () =>
            academyDetail?.data.find(
                (material) =>
                    material.id == academyMaterialContent?.material_id,
            ),
        [academyDetail, academyMaterialContent],
    )

    if (isLoading) {
        return <MaterialContentLoading />
    }

    if (isError || !academyMaterialContent) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Failed to load material content.</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                        <BookX className="text-gray-400 w-40 h-40" />
                        <p className="text-lg text-gray-500">
                            Material content could not be found.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>{academyMaterial?.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <CardTitle className="text-xl">
                        {academyMaterialContent.title}
                    </CardTitle>
                    <div
                        className="prose prose-slate"
                        dangerouslySetInnerHTML={{
                            __html: sanitizeContent(
                                academyMaterialContent.contents,
                            ),
                        }}
                    />
                </div>
            </CardContent>
            <MaterialContentFooter
                academyDetail={academyDetail}
                isLoading={isLoading}
                contentOrder={academyMaterialContent.order}
            />
        </Card>
    )
}
