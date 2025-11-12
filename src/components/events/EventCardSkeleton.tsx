export function EventCardSkeleton() {
    return (
        <div className="animate-pulse overflow-hidden rounded-2xl border bg-card shadow-sm">
            <div className="relative w-full aspect-video bg-slate-200">
                <div className="absolute right-3 top-3 h-6 w-16 rounded-md bg-slate-300"></div>
            </div>

            <div className="p-4">
                <div className="h-6 w-3/4 rounded-md bg-slate-200"></div>

                <div className="mt-3 flex flex-col gap-1.5">
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 rounded-full bg-slate-200"></div>
                        <div className="h-4 w-5/6 rounded-md bg-slate-200"></div>
                    </div>
                    <div className="flex items-center">
                        <div className="mr-2 h-4 w-4 rounded-full bg-slate-200"></div>
                        <div className="h-4 w-5/6 rounded-md bg-slate-200"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
