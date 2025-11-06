"use client"

import React, { useState, useEffect, useCallback, memo } from "react"
import { Question } from "@/types/attempt"
import { parseQuestionContent } from "@/lib/question-parser"

type CodeShortAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const areAnswersCorrect = (
    answers: string[],
    correctAnswer: string[],
): boolean => {
    if (answers.length !== correctAnswer.length) return false
    return answers.every((answer, idx) => answer === correctAnswer[idx])
}

const calculateInputWidth = (value: string): number => {
    const baseWidth = 64
    const charWidth = 9
    return Math.max(baseWidth, value.length * charWidth + 8)
}

type CodeInputProps = {
    value: string
    idx: number
    isReviewMode: boolean
    correctAnswer: string[]
    allAnswers: string[]
    onChange: (value: string, idx: number) => void
    onBlur: (idx: number) => void
}

const CodeInput = memo<CodeInputProps>(
    ({
        value,
        idx,
        isReviewMode,
        correctAnswer,
        allAnswers,
        onChange,
        onBlur,
    }) => {
        const handleChange = useCallback(
            (e: React.ChangeEvent<HTMLInputElement>) => {
                onChange(e.target.value, idx)
            },
            [idx, onChange],
        )

        const handleBlur = useCallback(() => {
            onBlur(idx)
        }, [idx, onBlur])

        const inputStyle = !isReviewMode
            ? "bg-blue-100 border-blue-300"
            : correctAnswer[idx] === allAnswers[idx]
              ? "bg-green-100 border-green-300"
              : "bg-red-100 border-red-300"

        const inputWidth = calculateInputWidth(value)

        return (
            <div className="relative inline-block mx-0.5">
                <input
                    disabled={isReviewMode}
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    style={{ width: `${inputWidth}px` }}
                    className={`${inputStyle} h-6 px-1 py-0 leading-tight focus:ring-offset-0 focus:ring-2 focus:ring-blue-500 text-sm border text-primary-950 font-mono transition-all min-w-16 rounded-sm`}
                    placeholder="?"
                />
            </div>
        )
    },
)

type ReviewResultProps = {
    answers: string[]
    correctAnswer: string[]
}

const ReviewResult = memo<ReviewResultProps>(({ answers, correctAnswer }) => {
    const isCorrect = areAnswersCorrect(answers, correctAnswer)

    if (isCorrect) {
        return (
            <span className="text-green-600 font-semibold">
                ✓ Jawaban Anda benar!
            </span>
        )
    }

    return (
        <div className="space-y-1">
            <span className="text-red-600 font-semibold">
                ✗ Jawaban Anda kurang tepat
            </span>
            <div>
                <span className="text-slate-600">Jawaban Anda: </span>
                <span className="text-red-600 font-mono">
                    {JSON.stringify(answers)}
                </span>
            </div>
            <div>
                <span className="text-slate-600">Jawaban Benar: </span>
                <span className="text-green-600 font-mono">
                    {JSON.stringify(correctAnswer)}
                </span>
            </div>
        </div>
    )
})

const CodeShortAnswer: React.FC<CodeShortAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const userSelected = question.current_answer ?? []
    const correctAnswer = question.correctAnswer ?? []

    const [answers, setAnswers] = useState<string[]>(userSelected)
    const [parsed, setParsed] = useState<ReturnType<
        typeof parseQuestionContent
    > | null>(null)
    const [lastQuestionId, setLastQuestionId] = useState<string>("")

    // Parse content only when question changes
    useEffect(() => {
        const parsed = parseQuestionContent(question.content || "")
        setParsed(parsed)
    }, [question.id, question.content])

    // Only sync when question actually changes (new question), not on every userSelected change
    useEffect(() => {
        if (question.id !== lastQuestionId) {
            setAnswers(userSelected)
            setLastQuestionId(question.id)
        }
    }, [question.id, userSelected, lastQuestionId])

    const handleChange = useCallback(
        (value: string, idx: number) => {
            if (isReviewMode) return
            const updated = [...answers]
            updated[idx] = value
            setAnswers(updated)
        },
        [isReviewMode, answers],
    )

    const handleBlur = useCallback(
        (idx: number) => {
            if (isReviewMode) return
            onAnswerChange?.(answers)
        },
        [isReviewMode, answers, onAnswerChange],
    )

    if (!parsed) {
        return <div>Loading...</div>
    }

    return (
        <div className="flex flex-col space-y-4">
            {parsed.instruction && (
                <div className="text-sm text-slate-700 bg-slate-50 p-3 rounded border border-slate-200">
                    {parsed.instruction}
                </div>
            )}

            <div className="code-display py-6 px-4 bg-slate-950 text-white rounded-md">
                <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
                    {(() => {
                        let globalBlankCounter = 0
                        return parsed.codeBlocks.map((block, blockIdx) => (
                            <div
                                key={blockIdx}
                                className="flex flex-wrap gap-0 items-center"
                            >
                                {block.parts.map((part, partIdx) => {
                                    if (part.type === "text") {
                                        return (
                                            <span
                                                key={`${blockIdx}-${partIdx}`}
                                                className="whitespace-pre-wrap break-words"
                                            >
                                                {part.content}
                                            </span>
                                        )
                                    } else {
                                        const currentBlankIndex =
                                            globalBlankCounter++
                                        const value =
                                            answers[currentBlankIndex] || ""
                                        return (
                                            <CodeInput
                                                key={`${blockIdx}-${partIdx}`}
                                                value={value}
                                                idx={currentBlankIndex}
                                                isReviewMode={isReviewMode}
                                                correctAnswer={correctAnswer}
                                                allAnswers={answers}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                        )
                                    }
                                })}
                            </div>
                        ))
                    })()}
                </pre>
            </div>

            {isReviewMode && (
                <div className="mt-3 space-y-2 text-sm">
                    <ReviewResult
                        answers={answers}
                        correctAnswer={correctAnswer}
                    />
                </div>
            )}
        </div>
    )
}

export default memo(CodeShortAnswer)
