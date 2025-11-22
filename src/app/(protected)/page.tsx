"use client"

import React, { useEffect, useState } from "react"
import { getEventList } from "@/lib/api"
import { Events, columns } from "@/components/table-events/columns"
import { DataTable } from "@/components/table-events/DataTable"
import CardPrivateEvent from "@/components/CardPrivateEvent"
import { toast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"

export default function Home() {
    const [data, setData] = useState<Events[]>([])
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const { user, isLoading: loadingUser } = useAuth()

    const fetchEvents = async () => {
        try {
            setLoading(true)
            const eventData = await getEventList()
            console.log("eventData", eventData)
            setData(eventData)
        } catch (err: any) {
            console.error("Error fetching events:", err)
            setError(err.message || "Failed to fetch events.")

            toast({
                variant: "destructive",
                title: "Error fetching events",
                description:
                    err.message ||
                    "Failed to fetch events. Please try again later.",
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <main className="home-page container text-foreground">
            <section className="greetings py-11">
                {loadingUser ? (
                    <span className="inline-block h-8 w-64 animate-pulse rounded-md bg-slate-300"></span>
                ) : (
                    <h1 className="text-2xl font-normal">
                        👋 Welcome Back{" "}
                        <span className="font-bold">
                            {user?.fullName || user?.username || "Guest"}
                        </span>
                    </h1>
                )}
            </section>

            <section className="pb-10 grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-8">
                <DataTable
                    columns={columns}
                    data={data}
                    loading={loading}
                    error={error}
                />

                <aside>
                    <CardPrivateEvent onEnrollSuccess={() => fetchEvents()} />
                </aside>
            </section>
        </main>
    )
}
