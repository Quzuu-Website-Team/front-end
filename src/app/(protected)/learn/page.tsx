"use client"

import React from "react"
import AcademyList from "./containers/AcademyList"
import RegisterPrivateAcademy from "./containers/RegisterPrivateAcademy"

export default function LearnAcademy() {
    return (
        <div className="container py-11 flex flex-col gap-6">
            <div className="flex justify-between gap-4 flex-wrap items-end">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold">
                        Explore Learning Materials
                    </h1>
                    <p className="text-muted-foreground text-base">
                        Find comprehensive guides and courses. Start your
                        journey here!
                    </p>
                </div>
                <RegisterPrivateAcademy />
            </div>
            <AcademyList />
        </div>
    )
}
