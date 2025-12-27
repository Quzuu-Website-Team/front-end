"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useMemo } from "react"
import DOMPurify from "isomorphic-dompurify"
import MaterialContentFooter from "./MaterialContentFooter"
import MaterialContentLoading from "./MaterialContentLoading"
import { Academy, AcademyMaterialContent } from "@/types/academy"
import { BookX } from "lucide-react"
import WelcomingContent from "./WelcomingContent"
import { UseMutationResult } from "@tanstack/react-query"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"

interface MaterialContentProps {
    academyDetail?: Academy
    academyMaterialContent?: AcademyMaterialContent
    isLoading: boolean
    isError: boolean
    markAsReadMutation: UseMutationResult<Boolean, Error, void, unknown>
}
export default function MaterialContent({
    academyDetail,
    academyMaterialContent,
    isLoading,
    isError,
    markAsReadMutation,
}: MaterialContentProps) {
    const sanitizeContent = (content?: string) => {
        if (!content) return ""
        return DOMPurify.sanitize(content, {
            USE_PROFILES: { html: true },
            ADD_ATTR: ["id", "class", "data-exam-slug"],
            ADD_TAGS: ["button"],
        })
    }

    const academyMaterial = useMemo(
        () =>
            academyDetail?.materials?.find(
                (material) =>
                    material.id == academyMaterialContent?.material_id,
            ),
        [academyDetail, academyMaterialContent],
    )

    const router = useRouter()
    const handleStartQuiz = (e: React.MouseEvent<HTMLDivElement>) => {
        const target = e.target as HTMLElement

        const quizButton = target.closest(
            "#btn-start-quiz-action",
        ) as HTMLElement | null

        if (quizButton) {
            e.preventDefault()
            const slug = quizButton.dataset.examSlug

            if (!slug) {
                toast({
                    title: "Quiz Not Available",
                    description:
                        "We're sorry, but the quiz for this material is currently unavailable. Please try again later or contact support if the issue persists.",
                    variant: "destructive",
                })
                return
            }

            // Navigate to academy exam page
            router.push(`/learn/${academyDetail?.slug}/exam/${slug}`)
        }
    }

    if (isLoading) {
        return <MaterialContentLoading />
    }

    if (
        academyDetail &&
        (!academyDetail?.register_status || !academyMaterialContent) &&
        !isError
    ) {
        return <WelcomingContent academyDetail={academyDetail} />
    }

    if (isError || !academyMaterialContent) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <CardTitle>Oops! Learning Material Not Found</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center gap-4 py-10">
                        <BookX className="text-gray-400 w-40 h-40" />
                        <p className="text-lg text-gray-500 text-center">
                            We couldn&apos;t locate the content you requested.
                            Please check the URL or try to open another
                            material.
                        </p>
                        <Link href="/learn">
                            <Button size="lg" className="rounded-lg">
                                Back to Learning Materials
                            </Button>
                        </Link>
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
                        onClick={handleStartQuiz}
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
                onNext={markAsReadMutation.mutate}
                nextIsLoading={markAsReadMutation.isPending}
            />
        </Card>
    )
}
