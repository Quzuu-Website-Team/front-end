"use client"

import React, { useMemo, useCallback, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"

import RadioAnswer from "./answers/RadioAnswer"
import CheckboxAnswer from "./answers/CheckboxAnswer"
import ShortAnswer from "./answers/ShortAnswer"
import ClickChipAnswer from "./answers/ClickChipAnswer"
import CodeShortAnswer from "./answers/CodeShortAnswer"
import FileAnswer from "./answers/FileAnswer"
import TrueFalseAnswer from "./answers/TrueFalseAnswer"
import CodeEditorAnswer from "./answers/CodeEditorAnswer"

import NavQuiz from "./NavQuiz"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Check, AlertCircle } from "lucide-react"
import { Attempt, Question, CodeMetadata } from "@/types/attempt"
import LoadingQuiz from "./LoadingQuiz"
import ExamNotFound from "./ExamNotFound"

type UserAnswers = Record<string, string[]>
type SavingStatus = "idle" | "saving" | "success" | "error"
type QuestionSavingState = Record<
    string,
    { status: SavingStatus; timestamp: number; metadata?: CodeMetadata }
>
type FileUploadingState = Record<string, boolean>

interface QuizContainerProps {
    // Quiz state from parent
    attempt: Attempt | null
    userAnswers: UserAnswers
    isLoading: boolean
    isSubmitting: boolean
    isReviewMode: boolean
    savingStates: QuestionSavingState
    fileUploadingStates: FileUploadingState

    // API callbacks
    onUpdateAnswer: (questionId: string, answerValue: string[]) => void
    onSubmitAnswers: () => Promise<void>

    // Navigation
    basePath: string

    // Timer control
    showRemainingTime?: boolean
}

const QuizContainer: React.FC<QuizContainerProps> = ({
    attempt,
    userAnswers,
    isLoading,
    isSubmitting,
    isReviewMode,
    savingStates,
    fileUploadingStates,
    onUpdateAnswer,
    onSubmitAnswers,
    basePath,
    showRemainingTime = true, // Default to true for backward compatibility
}) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const numberPage = searchParams.get("num")
    const currentNumber = numberPage ? parseInt(numberPage, 10) : 1

    const attemptScore = useMemo(() => {
        if (!isReviewMode) return undefined

        const totalScore =
            attempt?.answers.reduce((acc, answer) => acc + answer.score, 0) || 0
        const maxScore =
            attempt?.questions.reduce(
                (acc, question) => acc + (question.corr_mark || 0),
                0,
            ) || 0

        return {
            score: totalScore,
            max_score: maxScore,
        }
    }, [attempt, isReviewMode])

    const allowNavigationRef = useRef(false)

    const currentQuestion = useMemo(() => {
        const question = attempt?.questions[currentNumber - 1]
        if (!question) return null

        return {
            ...question,
            current_answer:
                userAnswers[question.id_question] ??
                question.current_answer ??
                [],
        }
    }, [attempt?.questions, currentNumber, userAnswers])

    const currentSavingStatus = currentQuestion
        ? savingStates[currentQuestion.id_question]?.status || "idle"
        : "idle"

    const handleNavigate = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && currentNumber > 1) {
                allowNavigationRef.current = true
                router.push(`?num=${currentNumber - 1}`)
            }
            if (
                direction === "next" &&
                currentNumber < (attempt?.questions?.length || 0)
            ) {
                allowNavigationRef.current = true
                router.push(`?num=${currentNumber + 1}`)
            }
        },
        [currentNumber, attempt?.questions, router],
    )

    const renderQuestionByType = useCallback(
        (question: Question) => {
            const handleAnswerChange = (answer: string[]) => {
                onUpdateAnswer(question.id_question, answer)
            }

            const metadata = savingStates[question.id_question]?.metadata
            const isFileUploading =
                fileUploadingStates[question.id_question] || false
            const commonProps = {
                question,
                isReviewMode,
                onAnswerChange: handleAnswerChange,
            }

            switch (question.type) {
                case "multiple_choices":
                    return <RadioAnswer {...commonProps} />
                case "multiple_choices_complex":
                    return <CheckboxAnswer {...commonProps} />
                case "short_answer":
                    return <ShortAnswer {...commonProps} />
                case "code_puzzle":
                    if (question.options && question.options.length > 0) {
                        return <ClickChipAnswer {...commonProps} />
                    }
                    return <CodeShortAnswer {...commonProps} />
                case "code_type":
                    return <CodeShortAnswer {...commonProps} />
                case "upload_file":
                    return (
                        <FileAnswer
                            {...commonProps}
                            isUploading={isFileUploading}
                        />
                    )
                case "true_false":
                    return <TrueFalseAnswer {...commonProps} />
                case "competitive_programming":
                    return (
                        <CodeEditorAnswer
                            {...commonProps}
                            metadata={metadata}
                        />
                    )
                default:
                    return <div>Tipe soal tidak dikenali: {question.type}</div>
            }
        },
        [isReviewMode, onUpdateAnswer, savingStates, fileUploadingStates],
    )

    const MemoizedQuestionComponent = useMemo(() => {
        if (!currentQuestion) return null
        return renderQuestionByType(currentQuestion)
    }, [currentQuestion, renderQuestionByType])

    if (isLoading) return <LoadingQuiz />

    if (!currentQuestion) {
        return <ExamNotFound />
    }

    return (
        <div className="pb-10 grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
            <NavQuiz
                totalQuestions={attempt?.questions?.length || 0}
                basePath={basePath}
                isReviewMode={isReviewMode}
                onSubmitAnswers={onSubmitAnswers}
                isSubmitting={isSubmitting}
                userAnswers={userAnswers}
                questions={attempt?.questions || []}
                remainingTime={attempt?.remaining_time}
                showRemainingTime={showRemainingTime && !attempt?.submitted}
                attemptScore={attemptScore}
            />

            <div className="display-quiz col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <span className="width-fit rounded-full font-bold bg-tertiary text-white py-2 px-4">
                        Question {currentNumber}
                    </span>

                    {currentSavingStatus === "saving" && (
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <div className="animate-spin w-4 h-4 border-2 border-slate-300 border-t-primary rounded-full" />
                            Menyimpan...
                        </div>
                    )}
                    {currentSavingStatus === "success" && (
                        <div className="flex items-center gap-2 text-sm text-green-600">
                            <Check size={16} />
                            Tersimpan
                        </div>
                    )}
                    {currentSavingStatus === "error" && (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertCircle size={16} />
                            Gagal menyimpan
                        </div>
                    )}
                </div>

                {currentQuestion.type !== "code_puzzle" &&
                    currentQuestion.type !== "code_type" &&
                    currentQuestion.type !== "competitive_programming" && (
                        <p className="text-base">{currentQuestion.question}</p>
                    )}

                {MemoizedQuestionComponent}

                {isReviewMode && (
                    <div className="p-4 bg-yellow-50 border border-yellow-300 rounded">
                        <p className="text-yellow-600 font-semibold">
                            Anda sudah submit jawaban. Hasil di atas adalah
                            review.
                        </p>
                    </div>
                )}

                <div className="mt-auto flex justify-between gap-4">
                    {currentNumber > 1 && (
                        <Button
                            onClick={() => handleNavigate("prev")}
                            disabled={isSubmitting}
                            iconLeft={<ChevronLeft size={20} />}
                            variant="outline"
                        >
                            Back
                        </Button>
                    )}
                    {currentNumber < (attempt?.questions?.length || 0) && (
                        <Button
                            onClick={() => handleNavigate("next")}
                            disabled={isSubmitting}
                            variant="outline"
                            className="ml-auto"
                            iconRight={<ChevronRight size={20} />}
                        >
                            Next
                        </Button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default QuizContainer
