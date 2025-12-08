import { SearchX } from "lucide-react"
import React from "react"

export default function EmptyMyAcademyList() {
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <SearchX className="text-gray-400 w-40 h-40" />
                <div className="space-y-1 text-muted-foreground">
                    <h1 className="text-3xl font-bold">
                        You have no registered academies!
                    </h1>
                    <p className="text-base">
                        Enroll to available academies to start learning.
                    </p>
                </div>
            </div>
        </div>
    )
}
