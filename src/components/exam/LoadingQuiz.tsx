import React from "react"

export default function LoadingQuiz() {
    return (
        <div className="pb-10 grid grid-cols-1 lg:grid-cols-3 gap-y-8 lg:gap-x-8">
            <div className="h-96 w-full animate-pulse rounded-3xl bg-slate-200"></div>
            <div className="h-96 w-full col-span-2 animate-pulse rounded-3xl bg-slate-200"></div>
        </div>
    )
}
