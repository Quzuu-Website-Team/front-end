"use client"

import { Button } from "@/components/ui/button"
import { BookX } from "lucide-react"
import React from "react"

export default function AcademyListError() {
    const onRefresh = () => {
        window.location.reload()
    }
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <BookX className="text-gray-400 w-40 h-40" />
                <p className="text-lg text-gray-500 max-w-xl">
                    We couldn&apos;t load the learning materials. Please check
                    your internet connection and try refreshing the page.
                </p>
            </div>

            <Button onClick={onRefresh} size="lg" className="rounded-lg">
                Refresh Page
            </Button>
        </div>
    )
}
