"use client"

import { Button } from "@/components/ui/button"
import { BookX } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function AcademyMaterialError() {
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <BookX className="text-gray-400 w-40 h-40" />
                <p className="text-lg text-gray-500">
                    Failed to load learning material. Please try again later.
                </p>

                <Link href="/learn">
                    <Button size="lg" className="rounded-lg">
                        Go back to learn
                    </Button>
                </Link>
            </div>
        </div>
    )
}
