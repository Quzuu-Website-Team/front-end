"use client"

import { useState, useEffect } from "react"
import { DataTableLeaderboard } from "@/components/table-leaderboard/DataTableLeaderboard"
import {
    leaderboardColumns,
    LeaderboardData,
} from "@/components/table-leaderboard/columns"

const Scoreboard = () => {
    const [quiz, setQuiz] = useState("quiz1")
    const [leaderboardData, setLeaderboardData] = useState<LeaderboardData[]>(
        [],
    )

    useEffect(() => {
        fetch("/dummyLeaderboard.json")
            .then((res) => res.json())
            .then((data) => {
                const result = data[quiz] || []
                setLeaderboardData(result)
            })
            .catch((err) =>
                console.error("Error fetching leaderboard data:", err),
            )
    }, [quiz])

    return (
        <DataTableLeaderboard
            columns={leaderboardColumns}
            data={leaderboardData}
        />
    )
}

export default Scoreboard
