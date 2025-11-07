"use client"

import React, { useMemo, memo, useState, useCallback } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Countdown from "@/components/Countdown"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { Question } from "@/types/attempt"
import SubmitConfirmDialog from "./SubmitConfirmDialog"
import ClarificationDialog from "./ClarificationDialog"

type UserAnswers = Record<string, string[]>

type NavQuizProps = {
    totalQuestions: number
    basePath: string
    onSubmitAnswers: () => Promise<void>
    isReviewMode?: boolean
    userAnswers?: UserAnswers
    questions?: Question[]
    remainingTime?: number
}

type QuestionButtonProps = {
    num: number
    isActive: boolean
    isAnswered: boolean
    basePath: string
}

const QuestionButton = memo<QuestionButtonProps>(
    ({ num, isActive, isAnswered, basePath }) => (
        <Link
            href={`${basePath}?num=${num}`}
            className={cn(
                `flex justify-center items-center rounded-lg border-2 text-xl font-semibold m-1.5 relative transition-all hover:opacity-80`,
                isActive
                    ? "border-primary text-primary bg-primary-50 font-bold"
                    : isAnswered
                      ? "bg-primary text-white border-primary"
                      : "border-slate-300 text-slate-400",
            )}
            style={{ width: "54px", height: "47px" }}
        >
            {num.toString().padStart(2, "0")}
        </Link>
    ),
)
QuestionButton.displayName = "QuestionButton"

const NavQuiz: React.FC<NavQuizProps> = ({
    totalQuestions,
    basePath,
    isReviewMode = false,
    onSubmitAnswers,
    userAnswers = {},
    questions = [],
    remainingTime,
}) => {
    const [isDialogSubmitOpen, setDialogSubmit] = useState(false)
    const [isDialogClarificationOpen, setDialogClarification] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("num")
    const activePage = pageNumber ? parseInt(pageNumber, 10) : 1

    const handleOpenSubmitDialog = useCallback(() => {
        setDialogSubmit(true)
    }, [])

    const handleOpenClarificationDialog = useCallback(() => {
        setDialogClarification(true)
    }, [])

    const handleConfirmSubmit = useCallback(async () => {
        setIsSubmitting(true)
        await onSubmitAnswers()
        setIsSubmitting(false)
        setDialogSubmit(false)
    }, [onSubmitAnswers])

    const handleConfirmClarification = useCallback(async () => {
        setDialogClarification(false)
    }, [])

    const handleCancelSubmit = useCallback(() => {
        setDialogSubmit(false)
    }, [])

    const handleCancelClarification = useCallback(() => {
        setDialogClarification(false)
    }, [])

    const answeredStatus = useMemo(() => {
        const status: Record<number, boolean> = {}

        questions.forEach((question, index) => {
            const questionNumber = index + 1
            const answer = userAnswers[question.id]
            status[questionNumber] = Array.isArray(answer) && answer.length > 0
        })

        return status
    }, [userAnswers, questions])

    return (
        <div className="bg-white pt-4 pb-6 px-6 rounded-3xl text-slate-800 shadow">
            <div className="timer px-6">
                <h3 className="text-xl font-semibold text-foreground/80 mb-1">
                    Time Left
                </h3>
                <div className="run-timer py-3 px-5 rounded-2xl border border-secondary">
                    <Countdown initialTime={remainingTime} />
                </div>
            </div>

            <div className="questions-number mt-5 flex flex-wrap justify-center">
                {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                    (num) => {
                        const isActive = activePage === num
                        const isAnswered = answeredStatus[num]

                        return (
                            <QuestionButton
                                key={num}
                                num={num}
                                isActive={isActive}
                                isAnswered={isAnswered}
                                basePath={basePath}
                            />
                        )
                    },
                )}
            </div>

            <div className="buttons mt-4 flex flex-col gap-4">
                <Button
                    variant="outline"
                    onClick={handleOpenClarificationDialog}
                >
                    Clarification
                </Button>
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
                    <Button
                        onClick={handleOpenSubmitDialog}
                        disabled={isSubmitting}
                    >
                        Submit Answers
                    </Button>
                )}
            </div>

            <SubmitConfirmDialog
                isOpen={isDialogSubmitOpen}
                onConfirm={handleConfirmSubmit}
                onCancel={handleCancelSubmit}
                isLoading={isSubmitting}
            />
            <ClarificationDialog
                isOpen={isDialogClarificationOpen}
                onConfirm={handleConfirmClarification}
                onCancel={handleCancelClarification}
            />
        </div>
    )
}

export default memo(NavQuiz)
