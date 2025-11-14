import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import React from "react"

export default function MaterialContentLoading() {
    return (
        <Card className="col-span-2">
            <CardHeader>
                <CardTitle>
                    <div className="h-8 w-1/2 bg-gray-200 rounded-full animate-pulse"></div>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <CardTitle className="text-xl">
                        <div className="h-6 w-1/3 bg-gray-200 rounded-full animate-pulse"></div>
                    </CardTitle>
                    <div className="h-5 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-full bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="h-5 w-2/3 bg-gray-200 rounded-full animate-pulse"></div>
                </div>
                <hr />
            </CardContent>
            <CardFooter className="flex justify-between">
                <div className="h-10 w-36 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-10 w-36 bg-gray-200 rounded-full animate-pulse"></div>
            </CardFooter>
        </Card>
    )
}
