import { FileQuestion } from "lucide-react"
import { Button } from "../ui/button"

export default function ExamNotFound() {
    const onBack = () => {
        window.history.back()
    }
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <FileQuestion className="text-gray-400 w-40 h-40" />
                <div className="space-y-1 text-muted-foreground">
                    <h1 className="text-3xl font-bold">Quiz Not Found</h1>
                    <p className="text-base">
                        We couldn&apos;t locate this assessment. It may have
                        been removed or the link is incorrect.
                    </p>
                </div>
                <Button onClick={onBack} size="lg" className="rounded-lg">
                    Back
                </Button>
            </div>
        </div>
    )
}
