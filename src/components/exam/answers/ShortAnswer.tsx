"use client"

import React, { useState, useCallback, memo, useEffect } from "react"
import { Input } from "../../ui/input"
import { Question } from "@/types/attempt"

type ShortAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const [localInput, setLocalInput] = useState<string>(
        question.current_answer?.[0] ?? "",
    )

    // Sync state when question or answer changes
    useEffect(() => {
        const answer = question.current_answer?.[0] ?? ""
        setLocalInput(answer)
    }, [question.id_question, question.current_answer])

    const handleInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (isReviewMode) return
            setLocalInput(event.target.value)
        },
        [isReviewMode],
    )

    const handleBlur = useCallback(() => {
        if (isReviewMode) return
        onAnswerChange?.([localInput])
    }, [isReviewMode, localInput, onAnswerChange])

    const isCorrect =
        localInput.trim().toLowerCase() ===
        (question.ans_key?.[0] ?? "").trim().toLowerCase()

    const inputStyle = isReviewMode
        ? isCorrect
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-300"
        : "bg-white border-slate-300"

    return (
        <div className="relative max-w-sm">
            <Input
                type="text"
                placeholder="Your Answer"
                value={localInput}
                onChange={handleInputChange}
                onBlur={handleBlur}
                disabled={isReviewMode}
                className={`ring-primary ${inputStyle}`}
            />

            {isReviewMode && (
                <div className="mt-3 text-sm space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="font-medium">Your Answer:</span>
                        <span
                            className={
                                isCorrect ? "text-green-600" : "text-red-600"
                            }
                        >
                            {localInput || "-"}
                        </span>
                    </div>
                    {!isCorrect && question.ans_key?.[0] && (
                        <div className="flex items-center gap-2">
                            <span className="font-medium">Correct Answer:</span>
                            <span className="text-green-600">
                                {question.ans_key[0]}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default memo(ShortAnswer)
