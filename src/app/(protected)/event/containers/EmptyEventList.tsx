import { Hourglass } from "lucide-react"

export default function EmptyEventList() {
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <Hourglass className="text-gray-400 w-40 h-40" />
                <div className="space-y-1 text-muted-foreground">
                    <h1 className="text-3xl font-bold">
                        No Active Events Yet!
                    </h1>
                    <p className="text-base">
                        Come back soon for exciting opportunities to test your
                        skills!
                    </p>
                </div>
            </div>
        </div>
    )
}
