"use client"

import React, { useState, useEffect, useCallback, memo, useMemo } from "react"
import { Question } from "@/types/attempt"
import { parseQuestionContent } from "@/lib/question-parser"

type CodeShortAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const areAnswersCorrect = (
    answers: string[],
    correct_answer: string[],
): boolean => {
    if (answers.length !== correct_answer.length) return false
    return answers.every((answer, idx) => answer === correct_answer[idx])
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
    correct_answer: string[]
    allAnswers: string[]
    onChange: (value: string, idx: number) => void
    onBlur: (idx: number) => void
}

const CodeInput = memo<CodeInputProps>(
    ({
        value,
        idx,
        isReviewMode,
        correct_answer,
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
            : correct_answer[idx] === allAnswers[idx]
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
CodeInput.displayName = "CodeInput"

type ReviewResultProps = {
    answers: string[]
    correct_answer: string[]
}

const ReviewResult = memo<ReviewResultProps>(({ answers, correct_answer }) => {
    const isCorrect = areAnswersCorrect(answers, correct_answer)

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
                    {JSON.stringify(correct_answer)}
                </span>
            </div>
        </div>
    )
})
ReviewResult.displayName = "ReviewResult"

const CodeShortAnswer: React.FC<CodeShortAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const userSelected = useMemo(
        () => question.current_answer ?? [],
        [question.current_answer],
    )
    const correct_answer = useMemo(
        () => question.ans_key ?? [],
        [question.ans_key],
    )

    const [answers, setAnswers] = useState<string[]>(userSelected)
    const [parsed, setParsed] = useState<ReturnType<
        typeof parseQuestionContent
    > | null>(null)
    const [lastQuestionId, setLastQuestionId] = useState<string>("")

    // Parse content only when question changes
    useEffect(() => {
        const parsed = parseQuestionContent(question.question || "")
        setParsed(parsed)
    }, [question.id_question, question.question])

    // Only sync when question actually changes (new question), not on every userSelected change
    useEffect(() => {
        if (question.id_question !== lastQuestionId) {
            setAnswers(userSelected)
            setLastQuestionId(question.id_question)
        }
    }, [
        question.id_question,
        userSelected,
        question.current_answer,
        lastQuestionId,
    ])

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
                <div className="text-base">{parsed.instruction}</div>
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
                                                correct_answer={correct_answer}
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
                        correct_answer={correct_answer}
                    />
                </div>
            )}
        </div>
    )
}

export default memo(CodeShortAnswer)
