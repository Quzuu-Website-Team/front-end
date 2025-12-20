"use client"

import React, { useMemo, useState } from "react"
import { columns } from "@/components/table-events/columns"
import { DataTable } from "@/components/table-events/DataTable"
import CardPrivateEvent from "@/components/CardPrivateEvent"
import { useAuth } from "@/contexts/AuthContext"
import { useGetListEvent } from "@/lib/queries/events"

export default function Home() {
    const { user, isLoading: loadingUser } = useAuth()
    const [page, setPage] = useState<number>(1)
    const [search, setSearch] = useState<string>("")

    const {
        data,
        isLoading: loadingListEvent,
        isRefetching: refetchingListEvent,
        isError,
    } = useGetListEvent({
        page,
        search,
    })

    const listEvent = useMemo(() => data?.data || [], [data])

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
                    data={listEvent}
                    loading={loadingListEvent || refetchingListEvent}
                    page={page}
                    totalPages={data?.totalPages}
                    setPage={setPage}
                    search={search}
                    setSearch={setSearch}
                />

                <aside>
                    <CardPrivateEvent />
                </aside>
            </section>
        </main>
    )
}
