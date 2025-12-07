import { BookCopy } from "lucide-react"

export default function EmptyAcademyList() {
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <BookCopy className="text-gray-400 w-40 h-40" />
                <div className="space-y-1 text-muted-foreground">
                    <h1 className="text-3xl font-bold">
                        No Learning Materials Yet!
                    </h1>
                    <p className="text-base">
                        Come back soon to advance your skills!
                    </p>
                </div>
            </div>
        </div>
    )
}
