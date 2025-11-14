"use client"

import dynamic from "next/dynamic"
import { Button } from "../../ui/button"
import React, { useState, useEffect, useMemo, useCallback, memo } from "react"
import { Question, CodeMetadata } from "@/types/attempt"
import { CheckCircle, XCircle, Clock, HardDrive } from "lucide-react"

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
    ssr: false,
})

type CodeEditorAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
    metadata?: CodeMetadata
}

const verdictConfig: Record<
    string,
    { color: string; icon: React.ReactNode; label: string }
> = {
    AC: {
        color: "bg-emerald-50 border-emerald-200",
        icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
        label: "Accepted",
    },
    WA: {
        color: "bg-red-50 border-red-200",
        icon: <XCircle className="w-5 h-5 text-red-600" />,
        label: "Wrong Answer",
    },
    TLE: {
        color: "bg-orange-50 border-orange-200",
        icon: <Clock className="w-5 h-5 text-orange-600" />,
        label: "Time Limit Exceeded",
    },
    RTE: {
        color: "bg-red-50 border-red-200",
        icon: <XCircle className="w-5 h-5 text-red-600" />,
        label: "Runtime Error",
    },
    CE: {
        color: "bg-yellow-50 border-yellow-200",
        icon: <XCircle className="w-5 h-5 text-yellow-600" />,
        label: "Compilation Error",
    },
}

const CodeEditorAnswer: React.FC<CodeEditorAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
    metadata,
}) => {
    const userCode = useMemo(
        () => question.current_answer?.[0] ?? "",
        [question.current_answer],
    )

    const [code, setCode] = useState<string>(() => userCode)

    // Sync state when question or answer changes
    useEffect(() => {
        setCode(userCode)
    }, [userCode, question.id_question, question.current_answer])

    const { language, instruction } = useMemo(() => {
        const contentParts = question.question.split(";")
        const languagePart = contentParts[0] || ""
        const language = languagePart.replace(/^language:\s*/i, "").trim()
        const instruction = contentParts.slice(1).join(";").trim()
        return { language, instruction }
    }, [question.question])

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
        <div className="code-editor-answer space-y-4">
            <p className="text-base">{instruction}</p>
            <div className="code-editor-wrapper overflow-hidden rounded-md">
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

            {metadata && (
                <div
                    className={`p-4 border-l-4 rounded ${verdictConfig[metadata.verdict].color}`}
                >
                    <div className="flex items-start gap-3">
                        {verdictConfig[metadata.verdict].icon}
                        <div className="flex-1">
                            <p className="font-semibold text-sm">
                                {verdictConfig[metadata.verdict].label}
                            </p>
                            <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <span className="text-slate-600">
                                        Score:
                                    </span>
                                    <span className="font-mono font-semibold">
                                        {metadata.score}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-600">
                                        {metadata.time_exec}ms
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HardDrive className="w-4 h-4 text-slate-500" />
                                    <span className="text-slate-600">
                                        {(metadata.memory / 1024).toFixed(2)}MB
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default memo(CodeEditorAnswer)
