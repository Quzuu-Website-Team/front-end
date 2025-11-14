"use client"

import { useEffect, useState } from "react"
import styles from "./start.module.css"
import { usePathname } from "next/navigation"
import SectionQuiz from "@/app/(protected)/event-details/[slug]/containers/SectionQuiz"
import Link from "next/link"
import { useGetListEventExam } from "@/lib/queries/events"
import LoadingExamList from "./containers/LoadingExamList"
import EmptyExamList from "./containers/EmptyExamList"

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

const StartQuiz = ({ params }: { params: { slug: string } }) => {
    const pathname = usePathname()

    const { isLoading, data } = useGetListEventExam(params.slug)

    if (isLoading) {
        return <LoadingExamList />
    }

    return (
        <div
            className={`${styles["card-section-quiz"]} max-h-screen overflow-y-auto h-full`}
        >
            {data?.length ? (
                data.map((exam) => (
                    <Link
                        key={exam.id_exam}
                        href={`${pathname}/${exam.slug}`}
                        className="block"
                    >
                        <SectionQuiz section={exam} />
                    </Link>
                ))
            ) : (
                <EmptyExamList />
            )}
        </div>
    )
}

export default StartQuiz
