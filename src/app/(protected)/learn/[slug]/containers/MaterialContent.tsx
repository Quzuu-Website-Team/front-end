"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React from "react"
import DOMPurify from "isomorphic-dompurify"
import MaterialContentFooter from "./MaterialContentFooter"
import MaterialContentLoading from "./MaterialContentLoading"
import { AcademyDetail, AcademyMaterialDetail } from "@/types/academy"
import { BookX } from "lucide-react"

export default function MaterialContent({
    academyDetail,
    academyMaterial,
    isLoading,
    isError,
}: {
    academyDetail?: AcademyDetail
    academyMaterial?: AcademyMaterialDetail
    isLoading: boolean
    isError: boolean
}) {
    const sanitizeContent = (content?: string) => {
        if (!content) return ""
        return DOMPurify.sanitize(content)
    }

    if (isLoading) {
        return <MaterialContentLoading />
    }

    if (isError || !academyMaterial) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Failed to load material content.</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                        <BookX className="text-gray-400 w-40 h-40" />
                        <p className="text-lg text-gray-500">
                            Error loading material content.
                        </p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>{academyMaterial?.material.title}</CardTitle>
            </CardHeader>
            <CardContent>
                {academyMaterial?.contents.map((content) => (
                    <div key={content.id} className="mb-4 space-y-4">
                        <div className="space-y-2" key={content.id}>
                            <CardTitle className="text-xl">
                                {content.title}
                            </CardTitle>
                            <div
                                className="prose prose-slate"
                                dangerouslySetInnerHTML={{
                                    __html: sanitizeContent(content.contents),
                                }}
                            />
                        </div>
                        <hr />
                    </div>
                ))}
            </CardContent>
            <MaterialContentFooter data={academyDetail} isLoading={isLoading} />
        </Card>
    )
}
