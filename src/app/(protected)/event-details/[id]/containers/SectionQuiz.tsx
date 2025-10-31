import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface SectionData {
    id: number
    title: string
    slug: string
    description: string
    isCompleted: boolean
    score: number
    correctCount: number
    wrongCount: number
    emptyCount: number
    reviewCount: number
    startTime: string | null
    endTime: string | null
    duration: string | null
}

type SectionQuizProps = {
    section: SectionData
}

const SectionQuiz: React.FC<SectionQuizProps> = ({ section }) => {
    const {
        title,
        description,
        isCompleted,
        score,
        correctCount,
        wrongCount,
        emptyCount,
        reviewCount,
        startTime,
        endTime,
        duration,
    } = section

    return (
        <Card
            className={cn(
                "mb-3.5",
                isCompleted && "bg-violet-100 border-l-4 border-violet-500",
            )}
        >
            <CardHeader>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-base text-slate-600 mt-2">
                    {description}
                </CardDescription>
            </CardHeader>

            {isCompleted && (
                <CardContent>
                    <div className="p-4 bg-white/70 rounded-lg space-y-1">
                        <p className="text-sm text-slate-700">
                            <strong>Score: </strong> {score}
                        </p>
                        <p className="text-sm text-slate-700">
                            <strong>Benar: </strong> {correctCount}{" "}
                            &nbsp;|&nbsp;
                            <strong>Salah: </strong> {wrongCount} &nbsp;|&nbsp;
                            <strong>Kosong: </strong> {emptyCount} &nbsp;|&nbsp;
                            <strong>Sedang Dinilai: </strong> {reviewCount}
                        </p>
                        <p className="text-sm text-slate-700">
                            <strong>Waktu Mengerjakan: </strong>
                            {startTime} - {endTime}
                            {duration && (
                                <span className="ml-2">({duration})</span>
                            )}
                        </p>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default SectionQuiz
