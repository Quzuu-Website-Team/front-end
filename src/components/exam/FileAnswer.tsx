"use client"

import React, { useState, useEffect, useCallback, memo } from "react"
import { Label } from "../ui/label"
import { Input } from "../ui/input"
import { Question } from "@/types/attempt"

type FileAnswerProps = {
    question: Question
    isReviewMode?: boolean
    onAnswerChange?: (answer: string[]) => void
}

type FileLinkProps = {
    fileUrl: string
    label: string
}

const FileLink = memo<FileLinkProps>(({ fileUrl, label }) => {
    if (fileUrl) {
        return (
            <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-blue-600 underline"
            >
                {label}
            </a>
        )
    }
    return <span className="ml-2 text-gray-500">(No file submitted)</span>
})

const FileAnswer: React.FC<FileAnswerProps> = ({
    question,
    isReviewMode = false,
    onAnswerChange,
}) => {
    const userFileUrl = question.current_answer?.[0] ?? ""
    const correctFileUrl = question.correctAnswer?.[0] ?? ""

    const [fileUrl, setFileUrl] = useState<string>(userFileUrl)

    useEffect(() => {
        setFileUrl(userFileUrl)
    }, [question.id])

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (isReviewMode) return

            const file = e.target.files?.[0]
            if (file) {
                const url = URL.createObjectURL(file)
                setFileUrl(url)
                onAnswerChange?.([url])
            } else {
                setFileUrl("")
                onAnswerChange?.([])
            }
        },
        [isReviewMode, onAnswerChange],
    )

    const isCorrect = fileUrl && fileUrl === correctFileUrl

    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="code-file">Submit Code File</Label>
            {!isReviewMode ? (
                <>
                    <Input
                        id="code-file"
                        type="file"
                        onChange={handleFileChange}
                        className={
                            fileUrl ? "border-primary bg-primary-100" : ""
                        }
                    />
                    {fileUrl && (
                        <p className="text-sm font-medium">
                            Review File Anda:
                            <FileLink fileUrl={fileUrl} label="Open file" />
                        </p>
                    )}
                </>
            ) : (
                <div className="p-4 border rounded-md">
                    <p className="text-sm font-medium">
                        Review File Anda:
                        <FileLink fileUrl={fileUrl} label="Open file" />
                    </p>
                    <p className="text-sm mt-2">
                        File Benar:
                        <FileLink
                            fileUrl={correctFileUrl}
                            label="Correct file"
                        />
                    </p>
                    {fileUrl && (
                        <p
                            className={`mt-2 font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}
                        >
                            {isCorrect
                                ? "File Anda benar."
                                : "File Anda tidak sesuai dengan expected file."}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export default memo(FileAnswer)
