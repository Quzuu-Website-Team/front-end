import { AcademyDetail } from "@/types/academy"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

export default function MaterialHeader({
    data,
    isLoading,
}: {
    data?: AcademyDetail
    isLoading: boolean
}) {
    if (isLoading) {
        return (
            <div className="flex gap-2 sm:items-center text-slate-600">
                <div className="h-5 w-20 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-5 w-80 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
        )
    }
    return (
        <div className="flex flex-wrap gap-2 sm:items-center text-slate-600">
            <Link
                href={`/learn`}
                className="flex items-center gap-1 text-primary hover:font-semibold transition-all"
            >
                <ChevronLeft size={18} />
                <p>Kembali</p>
            </Link>
            <p>/</p>
            <p>{data?.academy.title}</p>
        </div>
    )
}
