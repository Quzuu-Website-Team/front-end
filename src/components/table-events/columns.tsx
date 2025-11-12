"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { formatDateTime } from "@/lib/utils/date-utils"
import { getEventStatus } from "@/lib/utils/event-status"

export type Events = {
    id_event: string
    title: string
    // participant: number
    start_event: string
    end_event: string
}

export const columns: ColumnDef<Events>[] = [
    {
        accessorKey: "title",
        header: "Event Title",
    },
    {
        accessorKey: "start_event",
        header: "Start Date",
        cell: ({ row }) => {
            const date = row.getValue("start_event") as string
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{formatDateTime(date)}</span>
                </div>
            )
        },
    },
    {
        accessorKey: "end_event",
        header: "End Date",
        cell: ({ row }) => {
            const date = row.getValue("end_event") as string
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{formatDateTime(date)}</span>
                </div>
            )
        },
    },
    {
        id: "status",
        header: "Status",
        cell: ({ row }) => {
            const startDate = row.getValue("start_event") as string
            const endDate = row.getValue("end_event") as string
            const eventStatus = getEventStatus(startDate, endDate)

            return (
                <Badge variant={eventStatus.variant}>{eventStatus.label}</Badge>
            )
        },
    },
]
