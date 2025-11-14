"use client"

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { usePathname } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import {
    useGetAttemptEventExam,
    usePostAnswerEventExam,
    usePostAnswerEventExamFile,
    usePostSubmitEventExam,
} from "@/lib/queries/events"
import { Attempt, CodeMetadata } from "@/types/attempt"
import QuizContainer from "@/components/exam/QuizContainer"

type UserAnswers = Record<string, string[]>
type SavingStatus = "idle" | "saving" | "success" | "error"
type QuestionSavingState = Record<
    string,
    { status: SavingStatus; timestamp: number; metadata?: CodeMetadata }
>
type FileUploadingState = Record<string, boolean>

interface QuizContainerWrapperProps {
    eventSlug: string
    examSlug: string
}

const EventExam: React.FC<QuizContainerWrapperProps> = ({
    eventSlug,
    examSlug,
}) => {
    const pathName = usePathname()

    // Calculate basePath
    const basePath = useMemo(() => {
        const segments = pathName.split("/")
        return segments.slice(0, segments.indexOf("start") + 2).join("/")
    }, [pathName])

    // State management
    const [userAnswers, setUserAnswers] = useState<UserAnswers>({})
    const [isReviewMode, setIsReviewMode] = useState(false)
    const [savingStates, setSavingStates] = useState<QuestionSavingState>({})
    const [fileUploadingStates, setFileUploadingStates] =
        useState<FileUploadingState>({})

    // Refs for timer management
    const debounceTimersRef = useRef<Record<string, NodeJS.Timeout>>({})
    const fileUploadTimersRef = useRef<Record<string, NodeJS.Timeout>>({})
    const allowNavigationRef = useRef(false)

    // React Query: Fetch attempt data
    const {
        data: attempt,
        isLoading,
        isError,
        error: queryError,
        refetch: refetchAttempt,
        isRefetching: isRefetchingAttempt,
    } = useGetAttemptEventExam(eventSlug, examSlug)

    const postAnswerMutation = usePostAnswerEventExam(
        eventSlug,
        attempt?.id_attempt || "",
    )
    const postAnswerFileMutation = usePostAnswerEventExamFile(
        eventSlug,
        attempt?.id_attempt || "",
    )
    const submitMutation = usePostSubmitEventExam(
        eventSlug,
        attempt?.id_attempt || "",
    )

    // Initialize userAnswers when attempt loads
    useEffect(() => {
        if (attempt?.questions) {
            const initialized: UserAnswers = {}

            // Map answers from attempt.answers array
            const answersMap: Record<string, string[]> = {}
            if (attempt.answers && Array.isArray(attempt.answers)) {
                attempt.answers.forEach((ans) => {
                    answersMap[ans.id_question] = ans.answer ?? []
                })
            }

            console.log("Attempt Answers Map:", answersMap)

            attempt.questions.forEach((q) => {
                // Use answer from attempt.answers if available, otherwise use current_answer
                initialized[q.id_question] =
                    answersMap[q.id_question] ?? q.current_answer ?? []
            })
            console.log("Initialized User Answers:", initialized)
            setUserAnswers(initialized)
            setIsReviewMode(attempt.submitted)

            if (attempt.submitted) {
                allowNavigationRef.current = true
            }
        }
    }, [attempt])

    // Setup beforeunload listener
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (!isReviewMode && !allowNavigationRef.current) {
                e.preventDefault()
                e.returnValue = ""
            }
        }

        window.addEventListener("beforeunload", handleBeforeUnload)
        return () =>
            window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [isReviewMode])

    // Show error if attempt fetch fails
    useEffect(() => {
        if (isError) {
            toast({
                variant: "destructive",
                title: "Error loading attempt",
                description:
                    queryError?.message || "Failed to load quiz attempt",
            })
        }
    }, [isError, queryError])

    // Cleanup timers on unmount
    useEffect(() => {
        return () => {
            Object.values(debounceTimersRef.current).forEach(clearTimeout)
            Object.values(fileUploadTimersRef.current).forEach(clearTimeout)
        }
    }, [])

    // Handle answer updates
    const handleUpdateAnswer = useCallback(
        (questionId: string, answerValue: string[]) => {
            // Helper to extract CodeMetadata from response
            const extractMetadata = (
                meta_data?: any,
            ): CodeMetadata | undefined => {
                if (!meta_data) return undefined
                const result = meta_data.cp_grader_result
                if (result) {
                    return {
                        verdict: result.verdict as any,
                        score: result.score,
                        time_exec: result.time_exec,
                        memory: result.memory,
                    }
                }
                return undefined
            }

            const isFile =
                answerValue[0] &&
                typeof answerValue[0] === "object" &&
                (answerValue[0] as any) instanceof File

            if (isFile) {
                // Handle file upload
                const file = answerValue[0] as any as File
                setFileUploadingStates((prev) => ({
                    ...prev,
                    [questionId]: true,
                }))

                if (fileUploadTimersRef.current[questionId]) {
                    clearTimeout(fileUploadTimersRef.current[questionId])
                }

                fileUploadTimersRef.current[questionId] = setTimeout(() => {
                    postAnswerFileMutation.mutate(
                        {
                            question_id: questionId,
                            answer: [file] as any,
                        },
                        {
                            onSuccess: (result) => {
                                allowNavigationRef.current = true
                                const url = URL.createObjectURL(file)
                                setUserAnswers((prev) => ({
                                    ...prev,
                                    [questionId]: [url],
                                }))
                                setSavingStates((prev) => ({
                                    ...prev,
                                    [questionId]: {
                                        status: "success",
                                        timestamp: Date.now(),
                                        metadata: extractMetadata(
                                            result.meta_data,
                                        ),
                                    },
                                }))
                            },
                            onError: () => {
                                setSavingStates((prev) => ({
                                    ...prev,
                                    [questionId]: {
                                        status: "error",
                                        timestamp: Date.now(),
                                    },
                                }))
                                setTimeout(() => {
                                    setSavingStates((prev) => ({
                                        ...prev,
                                        [questionId]: {
                                            status: "idle",
                                            timestamp: 0,
                                        },
                                    }))
                                }, 3000)
                            },
                            onSettled: () => {
                                setFileUploadingStates((prev) => ({
                                    ...prev,
                                    [questionId]: false,
                                }))
                            },
                        },
                    )
                }, 500)
            } else {
                // Handle regular answer with debounce
                setUserAnswers((prev) => ({
                    ...prev,
                    [questionId]: answerValue,
                }))

                setSavingStates((prev) => ({
                    ...prev,
                    [questionId]: { status: "saving", timestamp: Date.now() },
                }))

                if (debounceTimersRef.current[questionId]) {
                    clearTimeout(debounceTimersRef.current[questionId])
                }

                debounceTimersRef.current[questionId] = setTimeout(() => {
                    postAnswerMutation.mutate(
                        {
                            question_id: questionId,
                            answer: answerValue,
                        },
                        {
                            onSuccess: (result) => {
                                allowNavigationRef.current = true
                                setSavingStates((prev) => ({
                                    ...prev,
                                    [questionId]: {
                                        status: "success",
                                        timestamp: Date.now(),
                                        metadata: extractMetadata(
                                            result.meta_data,
                                        ),
                                    },
                                }))
                            },
                            onError: () => {
                                setSavingStates((prev) => ({
                                    ...prev,
                                    [questionId]: {
                                        status: "error",
                                        timestamp: Date.now(),
                                    },
                                }))

                                setTimeout(() => {
                                    setSavingStates((prev) => ({
                                        ...prev,
                                        [questionId]: {
                                            status: "idle",
                                            timestamp: 0,
                                        },
                                    }))
                                }, 3000)
                            },
                        },
                    )
                }, 100)
            }
        },
        [postAnswerMutation, postAnswerFileMutation],
    )

    // Handle submit
    const handleSubmitAnswers = useCallback(async () => {
        submitMutation.mutate(undefined, {
            onSuccess: () => {
                refetchAttempt()
                toast({
                    title: "Answers submitted",
                    description:
                        "Your answers have been submitted successfully",
                })
            },
            onError: (error: any) => {
                toast({
                    variant: "destructive",
                    title: "Submission failed",
                    description:
                        error?.message ||
                        "Failed to submit answers. Please try again.",
                })
            },
        })
    }, [submitMutation, refetchAttempt])

    return (
        <QuizContainer
            attempt={attempt || null}
            userAnswers={userAnswers}
            isLoading={isLoading}
            isSubmitting={submitMutation.isPending || isRefetchingAttempt}
            isReviewMode={isReviewMode}
            savingStates={savingStates}
            fileUploadingStates={fileUploadingStates}
            onUpdateAnswer={handleUpdateAnswer}
            onSubmitAnswers={handleSubmitAnswers}
            basePath={basePath}
        />
    )
}

export default EventExam
