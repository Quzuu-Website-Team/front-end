"use client"

import { Button } from "@/components/ui/button"
import { SearchX } from "lucide-react"
import Link from "next/link"
import React from "react"

export default function EventDetailNotFound() {
    return (
        <div className="container text-center py-20 md:py-40">
            <div className="flex flex-col items-center justify-center gap-4 py-10">
                <SearchX className="text-gray-400 w-40 h-40" />
                <p className="text-lg text-gray-500">
                    Event not found. Please check the URL or return to the
                    events page.
                </p>

                <Link href="/event">
                    <Button size="lg" className="rounded-lg">
                        Go back to events
                    </Button>
                </Link>
            </div>
        </div>
    )
}
