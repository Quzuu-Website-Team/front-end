"use client"

import React, { useState, useEffect, useCallback, useMemo, memo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Question } from "@/types/attempt"

type TrueFalseAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const parseAnswersToArray = (
    answer: string[] | null,
    optionCount: number,
): number[] => {
    const result: number[] = Array(optionCount).fill(-1)

    if (!answer?.length) return result

    if (
        answer.length === optionCount &&
        answer.every((a) => a == "0" || a == "1")
    ) {
        return answer.map((a) => parseInt(a))
    }

    return result
}

type StatementRowProps = {
    option: string
    index: number
    userAnswer: number
    correct_answer: number
    isReviewMode: boolean
    onAnswerChange: (index: number, value: number) => void
}

const StatementRow = memo<StatementRowProps>(
    ({
        option,
        index,
        userAnswer,
        correct_answer,
        isReviewMode,
        onAnswerChange,
    }) => {
        const isCorrect = userAnswer === correct_answer && userAnswer !== -1
        const rowStyle =
            isReviewMode && isCorrect
                ? "bg-green-50"
                : isReviewMode
                  ? "bg-red-50"
                  : ""

        return (
            <TableRow className={rowStyle}>
                <TableCell>{option}</TableCell>
                <TableCell className="text-center">
                    <RadioGroup
                        className="flex justify-center"
                        value={userAnswer === 1 ? "1" : ""}
                        onValueChange={() => onAnswerChange(index, 1)}
                        disabled={isReviewMode}
                    >
                        <RadioGroupItem
                            value="1"
                            id={`true-${index}`}
                            disabled={isReviewMode}
                        />
                    </RadioGroup>
                </TableCell>
                <TableCell className="text-center">
                    <RadioGroup
                        className="flex justify-center"
                        value={userAnswer === 0 ? "0" : ""}
                        onValueChange={() => onAnswerChange(index, 0)}
                        disabled={isReviewMode}
                    >
                        <RadioGroupItem
                            value="0"
                            id={`false-${index}`}
                            disabled={isReviewMode}
                        />
                    </RadioGroup>
                </TableCell>
            </TableRow>
        )
    },
)
StatementRow.displayName = "StatementRow"

const TrueFalseAnswer: React.FC<TrueFalseAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const optionCount = question.options?.length ?? 0

    // Initialize state with array format
    const [localAnswers, setLocalAnswers] = useState<number[]>(() =>
        parseAnswersToArray(question.current_answer ?? [], optionCount),
    )

    const [lastQuestionId, setLastQuestionId] = useState<string>("")

    // Add effect to sync when question changes
    useEffect(() => {
        if (question.id !== lastQuestionId) {
            setLocalAnswers(
                parseAnswersToArray(question.current_answer ?? [], optionCount),
            )
            setLastQuestionId(question.id)
        }
    }, [question.id, question.current_answer, optionCount, lastQuestionId])

    // Parse correct answers to array format
    const correct_answers = useMemo(
        () => parseAnswersToArray(question.correct_answer ?? [], optionCount),
        [question.correct_answer, optionCount],
    )

    const handleAnswerChange = useCallback(
        (index: number, value: number) => {
            if (isReviewMode) return

            const updated = [...localAnswers]
            updated[index] = value
            setLocalAnswers(updated)
            onAnswerChange?.(updated.map((a) => a.toString()))
        },
        [localAnswers, isReviewMode, onAnswerChange],
    )

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Pernyataan</TableHead>
                    <TableHead className="text-center">Benar</TableHead>
                    <TableHead className="text-center">Salah</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {question.options?.map((option, index) => (
                    <StatementRow
                        key={index}
                        option={option}
                        index={index}
                        userAnswer={localAnswers[index] ?? -1}
                        correct_answer={correct_answers[index] ?? -1}
                        isReviewMode={isReviewMode}
                        onAnswerChange={handleAnswerChange}
                    />
                ))}
            </TableBody>
        </Table>
    )
}

export default memo(TrueFalseAnswer)
