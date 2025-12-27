"use client"

import React, { useMemo, memo, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import Countdown from "@/components/Countdown"
import { ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { AttemptScore, Question } from "@/types/attempt"
import SubmitConfirmDialog from "./SubmitConfirmDialog"
import ClarificationDialog from "./ClarificationDialog"
import { CircularProgress } from "../ui/circular-progress"

type UserAnswers = Record<string, string[]>

type NavQuizProps = {
    totalQuestions: number
    basePath: string
    onSubmitAnswers: () => Promise<void>
    isReviewMode?: boolean
    userAnswers?: UserAnswers
    questions?: Question[]
    remainingTime?: number
    showRemainingTime?: boolean
    isSubmitting?: boolean
    attemptScore?: AttemptScore
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
    attemptScore,
    isReviewMode = false,
    onSubmitAnswers,
    userAnswers = {},
    questions = [],
    remainingTime,
    showRemainingTime = true,
    isSubmitting = false,
}) => {
    const [isDialogSubmitOpen, setDialogSubmit] = useState(false)
    const [isDialogClarificationOpen, setDialogClarification] = useState(false)

    const searchParams = useSearchParams()
    const pageNumber = searchParams.get("num")
    const activePage = pageNumber ? parseInt(pageNumber, 10) : 1

    const handleOpenSubmitDialog = useCallback(() => {
        setDialogSubmit(true)
    }, [])

    const handleOpenClarificationDialog = useCallback(() => {
        setDialogClarification(true)
    }, [])

    const handleConfirmSubmit = useCallback(() => {
        onSubmitAnswers()
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
            const answer = userAnswers[question.id_question]
            status[questionNumber] = Array.isArray(answer) && answer.length > 0
        })

        return status
    }, [userAnswers, questions])

    // Convert remaining time from minutes to seconds
    // Only calculate if showRemainingTime is true
    const remainingTimeInSeconds = useMemo(() => {
        if (!showRemainingTime) return undefined
        return remainingTime ? remainingTime * 60 : undefined
    }, [remainingTime, showRemainingTime])

    useEffect(() => {
        if (isDialogSubmitOpen && !isSubmitting) {
            setDialogSubmit(false)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitting])

    const [isTimeout, setIsTimeout] = useState(false)

    // Only handle timeout if showRemainingTime is true (timer is enabled)
    const handleTimeout = useCallback(() => {
        if (!showRemainingTime) return // Skip timeout logic if timer is disabled

        setIsTimeout(true)
        if (!isReviewMode) {
            onSubmitAnswers()
            setDialogSubmit(true)
        }
    }, [isReviewMode, onSubmitAnswers, showRemainingTime])

    return (
        <div className="bg-white pt-4 pb-6 px-6 rounded-3xl text-slate-800 shadow flex flex-col gap-6">
            {isReviewMode && attemptScore && (
                <div className="px-6 flex flex-col gap-4">
                    <h3 className="text-xl font-semibold text-foreground/80 mb-1">
                        Your Score: {attemptScore.score} /{" "}
                        <span className="text-foreground/80">
                            {attemptScore.max_score}
                        </span>
                    </h3>
                    <CircularProgress
                        className="h-40 text-2xl"
                        variant="primary"
                        progress={
                            (attemptScore.score / attemptScore.max_score) * 100
                        }
                        showLabel
                    />
                </div>
            )}
            {showRemainingTime && remainingTimeInSeconds !== undefined ? (
                <div className="timer px-6">
                    <h3 className="text-xl font-semibold text-foreground/80 mb-1">
                        Time Left
                    </h3>
                    <div className="run-timer py-3 px-5 rounded-2xl border border-secondary">
                        <Countdown
                            initialTime={remainingTimeInSeconds}
                            onTimeout={handleTimeout}
                        />
                    </div>
                </div>
            ) : (
                <h3 className="text-xl font-semibold text-foreground/80 mb-1 px-6 inline-block">
                    Questions
                </h3>
            )}

            <div className="questions-number flex flex-wrap justify-center">
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

            <div className="buttons flex flex-col gap-4 mt-auto">
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
                            Back
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
                isTimeout={isTimeout}
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
