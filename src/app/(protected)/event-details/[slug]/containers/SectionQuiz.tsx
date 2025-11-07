import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Award, CheckCircle2, XCircle, HelpCircle, Clock } from "lucide-react"

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
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary-50 to-purple-50 border border-primary-200 flex items-center gap-3">
                                <Award className="w-8 h-8 text-primary-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-primary-600 font-medium">
                                        Total Score
                                    </p>
                                    <p className="text-2xl font-bold text-primary-700">
                                        {score}
                                    </p>
                                </div>
                            </div>

                            {(startTime || endTime || duration) && (
                                <div className="p-3 rounded-2xl bg-tertiary-50 border border-tertiary-200 flex items-center gap-4">
                                    <Clock className="w-8 h-8 text-tertiary-600 flex-shrink-0 mt-0.5" />
                                    <div className="text-sm text-tertiary-800">
                                        <p className="text-base font-semibold">
                                            {startTime} - {endTime}
                                        </p>
                                        {duration && (
                                            <p className="text-sm text-tertiary-800">
                                                Durasi: {duration}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="p-3 xl:px-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-2 xl:gap-4">
                                <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-emerald-600 font-medium">
                                        Benar
                                    </p>
                                    <p className="text-xl font-semibold text-emerald-700">
                                        {correctCount}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 xl:px-4 rounded-2xl bg-red-50 border border-red-200 flex items-center gap-2 xl:gap-4">
                                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-red-600 font-medium">
                                        Salah
                                    </p>
                                    <p className="text-xl font-semibold text-red-700">
                                        {wrongCount}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 xl:px-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-2 xl:gap-4">
                                <XCircle className="w-6 h-6 text-slate-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-slate-600 font-medium">
                                        Kosong
                                    </p>
                                    <p className="text-xl font-semibold text-slate-700">
                                        {emptyCount}
                                    </p>
                                </div>
                            </div>

                            <div className="p-3 xl:px-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-2 xl:gap-4">
                                <HelpCircle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                                <div>
                                    <p className="text-sm text-amber-600 font-medium">
                                        Dinilai
                                    </p>
                                    <p className="text-xl font-semibold text-amber-700">
                                        {reviewCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            )}
        </Card>
    )
}

export default SectionQuiz
