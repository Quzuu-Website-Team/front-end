"use client"

import React, { useState, useCallback, memo, useEffect } from "react"
import { Question } from "@/types/attempt"

type RadioAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const CHAR_LABELS = Array.from({ length: 10 }, (_, i) =>
    String.fromCharCode(65 + i),
)

const getContainerClass = (
    answered: boolean,
    correct: boolean,
    isReviewMode: boolean,
): string => {
    if (!answered) return "bg-white border-slate-300 hover:bg-slate-50"
    if (isReviewMode)
        return correct
            ? "bg-green-50 border-green-300"
            : "bg-red-50 border-red-300"
    return "bg-primary-50 border-primary-300"
}

type OptionItemProps = {
    option: string
    index: number
    answered: boolean
    correct: boolean
    isReviewMode: boolean
    onSelect: (char: string) => void
}

const OptionItem = memo<OptionItemProps>(
    ({ option, index, answered, correct, isReviewMode, onSelect }) => {
        const char = CHAR_LABELS[index]

        return (
            <label
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${getContainerClass(answered, correct, isReviewMode)}`}
                onClick={() => onSelect(char)}
            >
                <span
                    className={`flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all duration-200 ${
                        answered
                            ? "border-primary bg-primary text-white"
                            : "border-slate-300"
                    }`}
                >
                    <span
                        className={`text-sm font-medium uppercase ${answered ? "text-white" : "text-slate-400"}`}
                    >
                        {char}
                    </span>
                </span>

                <span className="ml-3 text-slate-700 flex-1">{option}</span>

                {isReviewMode && correct && (
                    <span className="ml-2 text-green-600">✓</span>
                )}
                {isReviewMode && answered && !correct && (
                    <span className="ml-2 text-red-600">✗</span>
                )}
            </label>
        )
    },
)
OptionItem.displayName = "OptionItem"

const RadioAnswer: React.FC<RadioAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const [localSelected, setLocalSelected] = useState<string>(() =>
        question.current_answer ? question.current_answer[0] : "",
    )

    const [lastQuestionId, setLastQuestionId] = useState<string>("")

    useEffect(() => {
        if (question.id_question !== lastQuestionId) {
            // Convert binary format ['0','1','0','0'] to char label 'B'
            const answer = question.current_answer || []
            let selectedChar = ""
            if (answer.length > 0) {
                const selectedIndex = answer.findIndex((val) => val === "1")
                selectedChar =
                    selectedIndex >= 0 ? CHAR_LABELS[selectedIndex] : ""
            }

            setLocalSelected(selectedChar)
            setLastQuestionId(question.id_question)
        }
    }, [
        question.id_question,
        question.current_answer,
        question.options,
        lastQuestionId,
    ])

    const handleSelect = useCallback(
        (char: string) => {
            if (!isReviewMode) {
                setLocalSelected(char)
                // Convert to binary format: ['0', '1', '0', '0']
                const selectedIndex = CHAR_LABELS.indexOf(char)
                const binaryAnswer =
                    question.options?.map((_, idx) =>
                        idx === selectedIndex ? "1" : "0",
                    ) ?? []
                onAnswerChange?.(binaryAnswer)
            }
        },
        [isReviewMode, onAnswerChange, question.options],
    )

    const correct_answerChar = (() => {
        // Use ans_key (only available during review/submitted)
        if (!question.ans_key?.[0]) return ""

        const ansKey = question.ans_key

        // If format is binary ['0','1','0','0'], find the '1' index
        if (
            ansKey.length > 1 &&
            ansKey.every((a: string) => a === "0" || a === "1")
        ) {
            const correctIndex = ansKey.findIndex((val: string) => val === "1")
            return correctIndex >= 0 ? CHAR_LABELS[correctIndex] : ""
        }

        // Otherwise if it's a single char like 'B', return it directly
        if (ansKey[0].length === 1) return ansKey[0]

        return ""
    })()

    return (
        <div className="space-y-3">
            {question.options?.map((option, index) => (
                <OptionItem
                    key={CHAR_LABELS[index]}
                    option={option}
                    index={index}
                    answered={localSelected === CHAR_LABELS[index]}
                    correct={correct_answerChar === CHAR_LABELS[index]}
                    isReviewMode={isReviewMode}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    )
}

export default memo(RadioAnswer)
