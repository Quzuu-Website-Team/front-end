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
CheckboxItem.displayName = "CheckboxItem"

const CheckboxAnswer: React.FC<CheckboxAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const [localSelected, setLocalSelected] = useState<string[]>([])

    // Sync state when question or answer changes
    useEffect(() => {
        const answer = question.current_answer || []

        // Convert binary format ['0','1','0','1'] to char labels ['B','D']
        const convertedAnswer = answer
            .map((val, idx) => (val === "1" ? CHAR_LABELS[idx] : null))
            .filter((char): char is string => char !== null)

        setLocalSelected(convertedAnswer)
    }, [question.id_question, question.current_answer])

    const selectedSet = useMemo(() => new Set(localSelected), [localSelected])

    const correctChars = useMemo(() => {
        // Use ans_key (only available during review/submitted)
        if (!question.ans_key?.length || !question.options)
            return new Set<string>()

        const ansKey = question.ans_key

        // If format is binary ['0','1','0','1'], convert to char labels
        if (
            ansKey.length > 1 &&
            ansKey.every((a: string) => a === "0" || a === "1")
        ) {
            return new Set(
                ansKey
                    .map((val: string, idx: number) =>
                        val === "1" ? CHAR_LABELS[idx] : null,
                    )
                    .filter((char): char is string => char !== null),
            )
        }

        // Otherwise treat as char labels directly (fallback)
        return new Set(ansKey)
    }, [question.ans_key, question.options])

    const handleSelect = useCallback(
        (char: string) => {
            if (isReviewMode) return

            let updated = selectedSet.has(char)
                ? localSelected.filter((c) => c !== char)
                : [...localSelected, char]

            updated = updated.sort()

            setLocalSelected(updated)

            // Convert to binary format: ['0', '1', '0', '1']
            const binaryAnswer =
                question.options?.map((_, idx) =>
                    updated.includes(CHAR_LABELS[idx]) ? "1" : "0",
                ) ?? []
            onAnswerChange?.(binaryAnswer)
        },
        [
            isReviewMode,
            localSelected,
            selectedSet,
            onAnswerChange,
            question.options,
        ],
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
