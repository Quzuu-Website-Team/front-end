"use client"

import React, { useEffect, useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { attemptExam, submitExamAnswers } from "@/lib/api"

import RadioAnswer from "@/components/exam/RadioAnswer"
import CheckboxAnswer from "@/components/exam/CheckboxAnswer"
import ShortAnswer from "@/components/exam/ShortAnswer"
import ClickChipAnswer from "@/components/exam/ClickChipAnswer"
import CodeShortAnswer from "@/components/exam/CodeShortAnswer"
import FileAnswer from "@/components/exam/FileAnswer"
import TrueFalseAnswer from "@/components/exam/TrueFalseAnswer"
import CodeEditorAnswer from "@/components/exam/CodeEditorAnswer"

import NavQuiz from "./NavQuiz"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Attempt, Question } from "@/types/attempt"
import LoadingQuiz from "./LoadingQuiz"

type UserAnswers = Record<string, string[]>

interface QuizState {
    attempt: Attempt | null
    userAnswers: UserAnswers
    isSubmitting: boolean
    isReviewMode: boolean
}

const QuizContainer: React.FC<{ slug: string }> = ({ slug = "" }) => {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [quizState, setQuizState] = useState<QuizState>({
        attempt: null,
        userAnswers: {},
        isSubmitting: false,
        isReviewMode: false,
    })

    const searchParams = useSearchParams()
    const router = useRouter()
    const numberPage = searchParams.get("num")
    const currentNumber = numberPage ? parseInt(numberPage, 10) : 1

    // Fetch only runs ONCE when component mounts (slug-based fetch)
    // searchParams change does NOT trigger re-fetch
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const res = await attemptExam(slug)

                const initialized: UserAnswers = {}
                if (res?.questions) {
                    res.questions.forEach((q) => {
                        initialized[q.id] = q.current_answer ?? []
                    })
                }

                setQuizState((prev) => ({
                    ...prev,
                    attempt: res,
                    userAnswers: initialized,
                }))
                setIsLoading(false)
            } catch (error: any) {
                console.error("Error fetching questions:", error)
                toast({
                    variant: "destructive",
                    title: "Error fetching questions",
                    description: error.message || "Failed to load questions",
                })
                setIsLoading(false)
            }
        }

        fetchQuestions()
    }, [slug])

    const handleUpdateAnswer = (questionId: string, answerValue: string[]) => {
        setQuizState((prev) => ({
            ...prev,
            userAnswers: {
                ...prev.userAnswers,
                [questionId]: answerValue,
            },
        }))
    }

    const handleSubmitAnswers = useCallback(async () => {
        setQuizState((prev) => ({ ...prev, isSubmitting: true }))

        try {
            // Simulate delay for better UX
            await new Promise((r) => setTimeout(r, 1000))
            setQuizState((prev) => ({
                ...prev,
                isSubmitting: false,
                isReviewMode: true,
            }))

            toast({
                title: "Answers submitted",
                description: "Your answers have been submitted successfully",
            })
        } catch (error: any) {
            setQuizState((prev) => ({ ...prev, isSubmitting: false }))
            toast({
                variant: "destructive",
                title: "Submission failed",
                description:
                    error.message ||
                    "Failed to submit answers. Please try again.",
            })
        }
    }, [])

    const currentQuestion = useMemo(() => {
        const question = quizState.attempt?.questions[currentNumber - 1]
        if (!question) return null

        // Create a new question object with updated current_answer from userAnswers
        return {
            ...question,
            current_answer:
                quizState.userAnswers[question.id] ??
                question.current_answer ??
                [],
        }
    }, [quizState.attempt?.questions, currentNumber, quizState.userAnswers])

    const handleNavigate = useCallback(
        (direction: "prev" | "next") => {
            if (direction === "prev" && currentNumber > 1) {
                router.push(
                    `/event-details/1/start/${slug}?num=${currentNumber - 1}`,
                )
            }
            if (
                direction === "next" &&
                currentNumber < (quizState.attempt?.questions?.length || 0)
            ) {
                router.push(
                    `/event-details/1/start/${slug}?num=${currentNumber + 1}`,
                )
            }
        },
        [currentNumber, slug, quizState.attempt?.questions?.length, router],
    )

    const renderQuestionByType = useCallback(
        (question: Question) => {
            const handleAnswerChange = (answer: string[]) => {
                handleUpdateAnswer(question.id, answer)
            }

            const commonProps = {
                question,
                isReviewMode: quizState.isReviewMode,
                onAnswerChange: handleAnswerChange,
            }

            switch (question.question_type) {
                case "choice":
                    return <RadioAnswer {...commonProps} />
                case "multiple_choice":
                    return <CheckboxAnswer {...commonProps} />
                case "short_answer":
                    return <ShortAnswer {...commonProps} />
                case "code_puzzle":
                    if (question.options && question.options.length > 0) {
                        return <ClickChipAnswer {...commonProps} />
                    }
                    return <CodeShortAnswer {...commonProps} />
                case "upload_file":
                    return <FileAnswer {...commonProps} />
                case "true_false_choice":
                    return <TrueFalseAnswer {...commonProps} />
                case "competitive_programming":
                    return <CodeEditorAnswer {...commonProps} />
                default:
                    return (
                        <div>
                            Tipe soal tidak dikenali: {question.question_type}
                        </div>
                    )
            }
        },
        [quizState.isReviewMode, handleUpdateAnswer],
    )

    const MemoizedQuestionComponent = useMemo(() => {
        if (!currentQuestion) return null
        return renderQuestionByType(currentQuestion)
    }, [currentQuestion, renderQuestionByType])

    if (isLoading) return <LoadingQuiz />

    if (!currentQuestion) {
        return <div>Tidak ada soal untuk nomor {currentNumber}</div>
    }

    return (
        <div className="pb-10 grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
            <NavQuiz
                totalQuestions={quizState.attempt?.questions?.length || 0}
                basePath={`/event-details/1/start/${slug}`}
                isReviewMode={quizState.isReviewMode}
                onSubmitAnswers={handleSubmitAnswers}
                userAnswers={quizState.userAnswers}
                questions={quizState.attempt?.questions || []}
            />

            <div className="display-quiz col-span-2 bg-white p-9 rounded-3xl text-slate-800 shadow flex flex-col gap-4">
                <div>
                    <span className="width-fit rounded-full font-bold bg-primary text-white p-2.5">
                        Question {currentNumber}
                    </span>
                </div>

                {currentQuestion.question_type !== "code_puzzle" &&
                    currentQuestion.question_type !==
                        "competitive_programming" && (
                        <p className="text-base">{currentQuestion.content}</p>
                    )}

                {MemoizedQuestionComponent}

                {quizState.isReviewMode && (
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
                            disabled={quizState.isSubmitting}
                            iconLeft={<ChevronLeft size={20} />}
                            variant="outline"
                        >
                            Back
                        </Button>
                    )}
                    {currentNumber <
                        (quizState.attempt?.questions?.length || 0) && (
                        <Button
                            onClick={() => handleNavigate("next")}
                            disabled={quizState.isSubmitting}
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
