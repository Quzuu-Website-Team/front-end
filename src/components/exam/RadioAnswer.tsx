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

const parseCurrentAnswer = (
    currentAnswer: string[] | undefined,
    options: string[],
): string => {
    if (!currentAnswer?.[0]) return ""

    const answer = currentAnswer[0]
    if (answer.length === 1) return answer

    const index = options.indexOf(answer)
    return index >= 0 ? CHAR_LABELS[index] : ""
}

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

const RadioAnswer: React.FC<RadioAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const [localSelected, setLocalSelected] = useState<string>(() =>
        parseCurrentAnswer(question.current_answer, question.options ?? []),
    )

    const [lastQuestionId, setLastQuestionId] = useState<string>("")

    useEffect(() => {
        if (question.id !== lastQuestionId) {
            setLocalSelected(
                parseCurrentAnswer(
                    question.current_answer,
                    question.options ?? [],
                ),
            )
            setLastQuestionId(question.id)
        }
    }, [question.id, question.current_answer, question.options, lastQuestionId])

    const handleSelect = useCallback(
        (char: string) => {
            if (!isReviewMode) {
                setLocalSelected(char)
                onAnswerChange?.([char])
            }
        },
        [isReviewMode, onAnswerChange],
    )

    const correctAnswerChar = (() => {
        if (!question.correctAnswer?.[0]) return ""

        const correctAnswer = question.correctAnswer[0]
        if (correctAnswer.length === 1) return correctAnswer

        if (question.options) {
            const index = question.options.indexOf(correctAnswer)
            return index >= 0 ? CHAR_LABELS[index] : ""
        }

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
                    correct={correctAnswerChar === CHAR_LABELS[index]}
                    isReviewMode={isReviewMode}
                    onSelect={handleSelect}
                />
            ))}
        </div>
    )
}

export default memo(RadioAnswer)
