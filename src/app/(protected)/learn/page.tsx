import React from "react"
import AcademyList from "./containers/AcademyList"

export default function LearnAcademy() {
    return (
        <div className="container py-11 flex flex-col gap-6">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">
                    Explore Learning Materials
                </h1>
                <p className="text-muted-foreground text-base">
                    Find comprehensive guides and courses. Start your journey
                    here!
                </p>
            </div>
            <AcademyList />
        </div>
    )
}
