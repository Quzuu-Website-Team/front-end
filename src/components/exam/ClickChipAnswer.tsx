"use client"

import React, { useState, useEffect, useCallback, useMemo, memo } from "react"
import { Button } from "../ui/button"
import { Question } from "@/types/attempt"
import { parseQuestionContent, getBlankCount } from "@/lib/question-parser"

interface ClickChipAnswerProps {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const convertSelectedChipsToArray = (
    selectedChips: Record<number, string>,
    blankCount: number,
): string[] => {
    const result: string[] = []
    for (let i = 0; i < blankCount; i++) {
        if (selectedChips[i]) result.push(selectedChips[i])
    }
    return result
}

const areAnswersCorrect = (
    selectedChips: Record<number, string>,
    correctAnswer: string[],
    blankCount: number,
): boolean => {
    const answersArray: string[] = []
    for (let i = 0; i < blankCount; i++) {
        if (selectedChips[i]) answersArray.push(selectedChips[i])
    }
    if (answersArray.length !== correctAnswer.length) return false
    return answersArray.every((answer, idx) => answer === correctAnswer[idx])
}

type ReviewResultProps = {
    selectedChips: Record<number, string>
    correctAnswer: string[]
    blankCount: number
}

const ReviewResult = memo<ReviewResultProps>(
    ({ selectedChips, correctAnswer, blankCount }) => {
        const isCorrect = areAnswersCorrect(
            selectedChips,
            correctAnswer,
            blankCount,
        )
        const answersArray = convertSelectedChipsToArray(
            selectedChips,
            blankCount,
        )

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
                        {JSON.stringify(answersArray)}
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
    },
)

type BlankChipProps = {
    value: string
    index: number
    isReviewMode: boolean
    onRemove: (index: number) => void
}

const BlankChip = memo<BlankChipProps>(
    ({ value, index, isReviewMode, onRemove }) => {
        const handleClick = useCallback(() => {
            if (value && !isReviewMode) {
                onRemove(index)
            }
        }, [value, index, isReviewMode, onRemove])

        const chipStyle = value
            ? isReviewMode
                ? "bg-blue-500 text-white"
                : "bg-blue-500 text-white cursor-pointer hover:opacity-80 hover:bg-blue-600"
            : "bg-gray-300 text-gray-500 border border-dashed border-gray-500"

        return (
            <div
                className={`inline-flex items-center gap-1 mx-0.5 px-2 py-0.5 rounded text-sm whitespace-nowrap ${chipStyle}`}
                onClick={handleClick}
                title={
                    value && !isReviewMode ? "Klik untuk menghapus" : "Kosong"
                }
            >
                {value || "___"}
                {value && !isReviewMode && (
                    <span className="text-xs ml-1">✕</span>
                )}
            </div>
        )
    },
)

type OptionChipProps = {
    option: string
    isSelected: boolean
    optionIndex: number
    onSelect: (option: string, optionIndex: number) => void
}

const OptionChip = memo<OptionChipProps>(
    ({ option, isSelected, optionIndex, onSelect }) => {
        const handleClick = useCallback(() => {
            onSelect(option, optionIndex)
        }, [option, optionIndex, onSelect])

        return (
            <div
                onClick={handleClick}
                className={`py-2 px-3 rounded-md cursor-pointer transition-all ${
                    isSelected
                        ? "bg-slate-400 opacity-50 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
            >
                <code>{option}</code>
            </div>
        )
    },
)

const ClickChipAnswer: React.FC<ClickChipAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const userSelected = question.current_answer ?? []
    const correctAnswer = question.correctAnswer ?? []
    const options = question.options ?? []

    // Use object to track answers by blank index instead of array
    // This preserves blank positions when deleting an answer
    const [selectedChips, setSelectedChips] = useState<Record<number, string>>(
        () => {
            const initial: Record<number, string> = {}
            userSelected.forEach((chip, idx) => {
                initial[idx] = chip
            })
            return initial
        },
    )
    const [parsed, setParsed] = useState<
        ReturnType<typeof parseQuestionContent>
    >(() => parseQuestionContent(question.content || ""))
    const [lastQuestionId, setLastQuestionId] = useState<string>("")

    // Parse content only when question changes
    useEffect(() => {
        const parsed = parseQuestionContent(question.content || "")
        setParsed(parsed)
    }, [question.id, question.content])

    // Only sync when question actually changes (new question), not on every userSelected change
    useEffect(() => {
        if (question.id !== lastQuestionId) {
            const updated: Record<number, string> = {}
            userSelected.forEach((chip, idx) => {
                // Only add non-empty chips (ignore empty strings from previous conversion)
                if (chip) {
                    updated[idx] = chip
                }
            })
            setSelectedChips(updated)
            setLastQuestionId(question.id)
        }
    }, [question.id, userSelected, lastQuestionId])

    const blankCount = parsed ? getBlankCount(parsed.codeBlocks) : 0
    const selectedCount = Object.keys(selectedChips).length

    const filledBlankCount = useMemo(() => {
        let count = 0
        for (let i = 0; i < blankCount; i++) {
            if (selectedChips[i]) {
                count++
            } else {
                break
            }
        }
        return count
    }, [selectedChips, blankCount])

    const hasEmptyPosition = filledBlankCount < blankCount

    const handleSelectChip = useCallback(
        (optionValue: string, optionIndex: number) => {
            if (isReviewMode || !hasEmptyPosition) return

            let emptyPosition = -1
            for (let i = 0; i < blankCount; i++) {
                if (!selectedChips[i]) {
                    emptyPosition = i
                    break
                }
            }

            if (emptyPosition === -1) return

            const updatedChips = {
                ...selectedChips,
                [emptyPosition]: optionValue,
            }
            setSelectedChips(updatedChips)
            const answerArray = convertSelectedChipsToArray(
                updatedChips,
                blankCount,
            )
            onAnswerChange?.(answerArray)
        },
        [
            isReviewMode,
            hasEmptyPosition,
            blankCount,
            selectedChips,
            onAnswerChange,
        ],
    )

    const handleRemoveChip = useCallback(
        (blankIndex: number) => {
            if (isReviewMode) return

            const updatedChips = { ...selectedChips }
            delete updatedChips[blankIndex]
            setSelectedChips(updatedChips)
            const answerArray = convertSelectedChipsToArray(
                updatedChips,
                blankCount,
            )
            onAnswerChange?.(answerArray)
        },
        [isReviewMode, blankCount, selectedChips, onAnswerChange],
    )

    const handleReset = useCallback(() => {
        if (isReviewMode) return

        setSelectedChips({})
        onAnswerChange?.([])
    }, [isReviewMode, onAnswerChange])

    // Create Set for O(1) lookup instead of O(n²)
    const selectedChipsSet = useMemo(
        () => new Set(Object.values(selectedChips)),
        [selectedChips],
    )

    const isChipSelected = useCallback(
        (optionIndex: number): boolean => {
            return selectedChipsSet.has(question.options?.[optionIndex] || "")
        },
        [selectedChipsSet, question.options],
    )

    const renderedCodeBlock = useMemo(() => {
        const codeElements: React.ReactNode[] = []
        let blankCounter = 0

        parsed.codeBlocks.forEach((block, blockIdx) => {
            const blockParts: React.ReactNode[] = []

            block.parts.forEach((part, partIdx) => {
                if (part.type === "text") {
                    blockParts.push(
                        <span
                            key={`${blockIdx}-${partIdx}`}
                            className="whitespace-pre-wrap break-words"
                        >
                            {part.content}
                        </span>,
                    )
                } else {
                    const currentBlankIndex = blankCounter++
                    blockParts.push(
                        <BlankChip
                            key={`${blockIdx}-${partIdx}`}
                            value={selectedChips[currentBlankIndex] || ""}
                            index={currentBlankIndex}
                            isReviewMode={isReviewMode}
                            onRemove={handleRemoveChip}
                        />,
                    )
                }
            })

            codeElements.push(
                <div
                    key={blockIdx}
                    className="flex flex-wrap gap-0 items-center"
                >
                    {blockParts}
                </div>,
            )
        })

        return codeElements
    }, [parsed.codeBlocks, selectedChips, isReviewMode, handleRemoveChip])

    // Show loading state if not parsed yet
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

            <div className="code-display py-6 px-4 bg-slate-950 text-white rounded-md font-mono text-sm">
                <pre className="font-mono text-sm whitespace-pre overflow-x-auto">
                    {renderedCodeBlock}
                </pre>
            </div>

            {selectedCount > 0 && !isReviewMode && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedChips).map(([blankIdx, chip]) => (
                        <div
                            key={blankIdx}
                            className="bg-blue-500 text-white py-1 px-3 rounded-full text-sm flex items-center gap-2"
                        >
                            <span>{chip}</span>
                            <button
                                onClick={() =>
                                    handleRemoveChip(parseInt(blankIdx))
                                }
                                className="text-white hover:text-red-200 transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!isReviewMode && hasEmptyPosition && (
                <div className="flex gap-2 flex-wrap">
                    {options.map((option, idx) => (
                        <OptionChip
                            key={idx}
                            option={option}
                            optionIndex={idx}
                            isSelected={isChipSelected(idx)}
                            onSelect={handleSelectChip}
                        />
                    ))}
                </div>
            )}

            {!isReviewMode && selectedCount > 0 && (
                <Button variant="ghost" onClick={handleReset}>
                    Reset
                </Button>
            )}

            {isReviewMode && (
                <div className="mt-3 space-y-2 text-sm">
                    <ReviewResult
                        selectedChips={selectedChips}
                        correctAnswer={correctAnswer}
                        blankCount={blankCount}
                    />
                </div>
            )}
        </div>
    )
}

export default memo(ClickChipAnswer)
