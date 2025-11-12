import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export default function EventDetailSkeleton() {
    return (
        <Card className="text-slate-800">
            <CardHeader>
                <CardTitle>
                    <div className="h-8 w-60 bg-gray-200 rounded-full animate-pulse"></div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="h-6 w-full bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-full bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-6 w-2/3 bg-gray-200 rounded-full animate-pulse"></div>
            </CardContent>
        </Card>
    )
}
