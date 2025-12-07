import { Target } from "lucide-react"

export default function EmptyEventList() {
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <Target className="text-gray-400 w-40 h-40" />
                <p className="text-lg text-gray-500">No Active Events Yet!</p>
            </div>
        </div>
    )
}
