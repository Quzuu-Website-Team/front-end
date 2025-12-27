"use client"

import React, { useState, useEffect, useCallback, useMemo, memo } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../ui/table"
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
        if (question.id_question !== lastQuestionId || isReviewMode) {
            // Convert binary format ['0','1','0','1'] to number array [0,1,0,1]
            const answer = question.current_answer || []
            let parsedAnswer: number[] = Array(optionCount).fill(-1)

            if (
                answer.length === optionCount &&
                answer.every((a) => a === "0" || a === "1")
            ) {
                parsedAnswer = answer.map((a) => parseInt(a))
            }

            setLocalAnswers(parsedAnswer)
            setLastQuestionId(question.id_question)
        }
    }, [
        question.id_question,
        question.current_answer,
        optionCount,
        lastQuestionId,
        isReviewMode,
    ])

    // Parse correct answers to array format
    const correct_answers = useMemo(() => {
        // Use ans_key (only available during review/submitted)
        if (!question.ans_key?.length) {
            return Array(optionCount).fill(-1)
        }

        const ansKey = question.ans_key

        // If format is binary ['0','1','0','1'], convert to numbers
        if (
            ansKey.length === optionCount &&
            ansKey.every((a: string) => a === "0" || a === "1")
        ) {
            return ansKey.map((a: string) => parseInt(a))
        }

        // Fallback to unfilled
        return Array(optionCount).fill(-1)
    }, [question.ans_key, optionCount])

    const handleAnswerChange = useCallback(
        (index: number, value: number) => {
            if (isReviewMode) return

            const updated = [...localAnswers]
            updated[index] = value
            setLocalAnswers(updated)

            // Convert to binary format: ['0', '1', '0', '1']
            // where 1 = true, 0 = false, -1 stays as '0'
            const binaryAnswer = updated.map((a) => (a === 1 ? "1" : "0"))
            onAnswerChange?.(binaryAnswer)
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
