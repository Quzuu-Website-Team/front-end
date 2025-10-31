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

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                // Define an interface for your event data structure
                interface EventDataResponse {
                    events?: any[]
                    data?: any[]
                }

                // Updated to work with the new API implementation
                // The API now uses GET with data payload
                const eventData = (await getEventList()) as
                    | EventDataResponse
                    | any[]

                // Now TypeScript knows these properties exist
                if (Array.isArray(eventData)) {
                    // If API returns array directly
                    setData(eventData)
                } else if (eventData.events) {
                    // If API returns object with events property
                    setData(eventData.events)
                } else {
                    // If it's some other structure, try to adapt
                    console.warn("Unexpected event data structure:", eventData)
                    setData(Array.isArray(eventData.data) ? eventData.data : [])
                }
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
                            {user?.username || user?.email || "Guest"}
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
                    <CardPrivateEvent />
                </aside>
            </section>
        </main>
    )
}
