import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from "react"

export default function LoadingExamList() {
    return (
        <div className="flex flex-col gap-3">
            {Array(3)
                .fill(0)
                .map((_, index) => (
                    <Card
                        key={`loading-exam-${index}`}
                        className="text-slate-800"
                    >
                        <CardHeader>
                            <CardTitle>
                                <div className="h-8 w-60 bg-gray-200 rounded-full animate-pulse"></div>
                            </CardTitle>
                            <CardDescription>
                                <div className="h-6 w-full bg-gray-200 rounded-full animate-pulse"></div>
                            </CardDescription>
                            <CardDescription>
                                <div className="h-6 w-1/3 bg-gray-200 rounded-full animate-pulse"></div>
                            </CardDescription>
                        </CardHeader>
                    </Card>
                ))}
        </div>
    )
}
