"use client"

import React from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Countdown from "@/components/Countdown"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

type NavQuizProps = {
    totalQuestions: number
    basePath: string
    isReviewMode?: boolean
    onSubmitAnswers?: () => void
}

const NavQuiz: React.FC<NavQuizProps> = ({
    totalQuestions,
    basePath,
    isReviewMode = false,
    onSubmitAnswers,
}) => {
    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("num")
    const activePage = pageNumber ? parseInt(pageNumber, 10) : 1

    return (
        <div className="bg-white pt-4 pb-6 px-6 rounded-3xl text-slate-800 shadow">
            <div className="timer px-6">
                <h3 className="text-xl font-semibold text-foreground/80 mb-1">
                    Time Left
                </h3>
                <div className="run-timer py-3 px-5 rounded-2xl border border-secondary">
                    <Countdown />
                </div>
            </div>

            <div className="questions-number mt-5 flex flex-wrap justify-center">
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                    (num) => {
                        const isActive = activePage === num
                        return (
                            <Link
                                key={num}
                                href={`${basePath}?num=${num}`}
                                className={cn(
                                    `flex justify-center items-center rounded-lg border-2 text-xl font-semibold m-1.5`,
                                    isActive
                                        ? "border-primary text-primary bg-primary-50 font-bold"
                                        : "border-slate-300 text-slate-400",
                                )}
                                style={{ width: "54px", height: "47px" }}
                            >
                                {num.toString().padStart(2, "0")}
                            </Link>
                        )
                    },
                )}
            </div>

            <div className="buttons mt-4 flex flex-col gap-4">
                <Button variant="outline">Clarification</Button>
                {isReviewMode ? (
                    <Link href={basePath.split("/").slice(0, -1).join("/")}>
                        <Button
                            variant="outline"
                            className="w-full text-primary border-primary hover:bg-primary-50"
                            iconLeft={<ArrowLeft size={16} />}
                        >
                            Back to Event
                        </Button>
                    </Link>
                ) : (
                    <Button onClick={onSubmitAnswers}>Submit Answers</Button>
                )}
            </div>
        </div>
    )
}

export default NavQuiz
