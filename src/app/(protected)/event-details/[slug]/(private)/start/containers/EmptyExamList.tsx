import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen } from "lucide-react"
import Image from "next/image"
import React from "react"

export default function EmptyExamList() {
    return (
        <Card className="text-slate-800 flex-1 h-full">
            <CardHeader>
                <CardTitle>No Exams Available</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col items-center justify-center gap-4 py-10">
                    <BookOpen className="w-48 h-48 text-slate-400" />
                    <p className="text-lg text-gray-500">
                        No exam available for this event.
                    </p>
                </div>
            </CardContent>
        </Card>
    )
}
