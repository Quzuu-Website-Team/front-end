import React from "react"

export default function AcademyCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="relative w-full aspect-video bg-slate-200"></div>

            <div className="flex flex-col gap-4 p-4">
                <div>
                    <div className="h-6 w-3/4 rounded-md bg-slate-200 mb-2"></div>
                    <div className="h-4 w-full rounded-md bg-slate-200"></div>
                </div>

                <div className="flex flex-col">
                    <div className="flex justify-between items-center mb-2">
                        <div className="h-4 w-16 rounded-md bg-slate-200"></div>
                        <div className="h-4 w-12 rounded-md bg-slate-200"></div>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200"></div>
                </div>

                <div className="flex justify-between gap-4">
                    <div className="flex items-center gap-1">
                        <div className="h-5 w-5 rounded bg-slate-200"></div>
                        <div className="h-4 w-20 rounded-md bg-slate-200"></div>
                    </div>
                    <div className="h-6 w-16 rounded-md bg-slate-200"></div>
                </div>
            </div>
        </div>
    )
}
