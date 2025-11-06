"use client"

import dynamic from "next/dynamic"
import { Button } from "../ui/button"
import React, { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Question } from "@/types/attempt"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
})

type CodeEditorAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

const CodeEditorAnswer: React.FC<CodeEditorAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const userCode = useMemo(
        () => question.current_answer?.[0] ?? "",
        [question.current_answer?.[0]],
    )

    const [code, setCode] = useState<string>(() => userCode)

    useEffect(() => {
        setCode(userCode)
    }, [userCode])

    const { language, instruction } = useMemo(() => {
        const contentParts = question.content.split(";")
        const languagePart = contentParts[0] || ""
        const language = languagePart.replace(/^language:\s*/i, "").trim()
        const instruction = contentParts.slice(1).join(";").trim()
        return { language, instruction }
    }, [question.content])

    const editorOptions = useMemo(
        () => ({
            readOnly: isReviewMode,
        }),
        [isReviewMode],
    )

    const handleEditorChange = useCallback(
        (value: string | undefined) => {
            if (isReviewMode) return
            setCode(value || "")
        },
        [isReviewMode],
    )

    const handleSubmitCode = useCallback(() => {
        onAnswerChange?.([code])
    }, [code, onAnswerChange])

    return (
        <div className="code-editor-answer">
            <p className="text-base">{instruction}</p>
            <div className="code-editor-wrapper overflow-hidden rounded-md mt-4">
                <MonacoEditor
                    height="400px"
                    language={language}
                    theme="vs-dark"
                    value={code}
                    onChange={handleEditorChange}
                    options={editorOptions}
                />
            </div>

            {!isReviewMode && (
                <Button className="mt-4" onClick={handleSubmitCode}>
                    Submit Code
                </Button>
            )}
        </div>
    )
}

export default memo(CodeEditorAnswer)
