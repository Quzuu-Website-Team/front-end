"use client"

import { useEffect, useState } from "react"
import styles from "./start.module.css"
import { usePathname } from "next/navigation"
import SectionQuiz from "@/app/(protected)/event-details/[id]/containers/SectionQuiz"
import Link from "next/link"

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

const StartQuiz = () => {
    const pathname = usePathname()

    const [sections, setSections] = useState<SectionData[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const getSections = async () => {
            try {
                const res = await fetch("/dummySections.json")
                const data = await res.json()
                setSections(data)
            } catch (error) {
                console.error("Failed to fetch sections:", error)
            } finally {
                setIsLoading(false)
            }
        }
        getSections()
    }, [])

    if (isLoading) {
        return (
            <div className="py-8">
                <h1 className="text-2xl font-bold mb-4">
                    Loading section quiz...
                </h1>
            </div>
        )
    }

    return (
        <div
            className={`${styles["card-section-quiz"]} max-h-screen overflow-y-auto`}
        >
            {sections.map((section) => (
                <Link
                    key={section.id}
                    href={`${pathname}/${section.slug}`}
                    className="block"
                >
                    <SectionQuiz section={section} />
                </Link>
            ))}
        </div>
    )
}

export default StartQuiz
