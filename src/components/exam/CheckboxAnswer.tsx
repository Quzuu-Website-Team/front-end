"use client"

import React, { useState, useCallback, useMemo, memo, useEffect } from "react"
import { Question } from "@/types/attempt"

type CheckboxAnswerProps = {
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
): string[] => {
    if (!currentAnswer?.length) return []

    return currentAnswer
        .map((ans) => {
            if (ans.length === 1) return ans

            const index = options.indexOf(ans)
            return index >= 0 ? CHAR_LABELS[index] : ""
        })
        .filter(Boolean)
}

const getContainerClass = (
    selected: boolean,
    correct: boolean,
    isReviewMode: boolean,
): string => {
    if (!selected) {
        return isReviewMode && correct
            ? "bg-green-50 border-green-300"
            : "bg-white border-slate-300 hover:bg-slate-50"
    }

    if (!isReviewMode)
        return "bg-primary-50 border-primary-300 hover:bg-primary-100"
    return correct ? "bg-green-50 border-green-300" : "bg-red-50 border-red-300"
}

type CheckboxItemProps = {
    char: string
    option: string
    selected: boolean
    correct: boolean
    isReviewMode: boolean
    onSelect: (char: string) => void
}

const CheckboxItem = memo<CheckboxItemProps>(
    ({ char, option, selected, correct, isReviewMode, onSelect }) => (
        <label
            className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors duration-200 ${getContainerClass(selected, correct, isReviewMode)}`}
            onClick={() => onSelect(char)}
        >
            <span
                className={`flex items-center justify-center h-6 w-6 rounded border-2 transition-all ${
                    selected
                        ? "border-primary bg-primary text-white"
                        : "border-slate-300"
                }`}
            >
                <span
                    className={`text-sm font-semibold ${selected ? "text-white" : "text-slate-300"}`}
                >
                    {char}
                </span>
            </span>

            <span className="ml-3 text-slate-700 flex-1">{option}</span>

            {isReviewMode && correct && (
                <span className="ml-2 text-green-600">✓</span>
            )}
            {isReviewMode && selected && !correct && (
                <span className="ml-2 text-red-600">✗</span>
            )}
        </label>
    ),
)

const CheckboxAnswer: React.FC<CheckboxAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const [localSelected, setLocalSelected] = useState<string[]>(() =>
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

    const selectedSet = useMemo(() => new Set(localSelected), [localSelected])

    const correctChars = useMemo(() => {
        if (!question.correctAnswer?.length || !question.options)
            return new Set<string>()

        return new Set(
            question.correctAnswer
                .map((ans) => {
                    if (ans.length === 1) return ans
                    const index = question.options!.indexOf(ans)
                    return index >= 0 ? CHAR_LABELS[index] : ""
                })
                .filter(Boolean),
        )
    }, [question.correctAnswer, question.options])

    const handleSelect = useCallback(
        (char: string) => {
            if (isReviewMode) return

            const updated = selectedSet.has(char)
                ? localSelected.filter((c) => c !== char)
                : [...localSelected, char]

            setLocalSelected(updated)
            onAnswerChange?.(updated)
        },
        [isReviewMode, localSelected, selectedSet, onAnswerChange],
    )

    return (
        <div className="space-y-3">
            {question.options?.map((option, index) => {
                const char = CHAR_LABELS[index]
                return (
                    <CheckboxItem
                        key={char}
                        char={char}
                        option={option}
                        selected={selectedSet.has(char)}
                        correct={correctChars.has(char)}
                        isReviewMode={isReviewMode}
                        onSelect={handleSelect}
                    />
                )
            })}
        </div>
    )
}

export default memo(CheckboxAnswer)
