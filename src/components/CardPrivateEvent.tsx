"use client"

import React, { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { registerEvent } from "@/lib/api"
import { toast } from "@/hooks/use-toast"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card"

const CardPrivateEvent = () => {
    const [eventCode, setEventCode] = useState("")
    const [loading, setLoading] = useState(false)

    const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!eventCode.trim()) {
            toast({
                variant: "destructive",
                title: "Event code required",
                description: "Please enter an event code to enroll",
            })
            return
        }

        setLoading(true)

        try {
            interface EventRegistrationResponse {
                message?: string
                // Add other properties you expect in the response
                success?: boolean
                data?: any
            }

            const response = (await registerEvent(
                eventCode,
            )) as EventRegistrationResponse

            toast({
                title: "Successfully enrolled!",
                description:
                    response.message ||
                    "You have successfully enrolled in the event",
            })

            // Clear the input fields after successful enrollment
            setEventCode("")
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error enrolling in event",
                description:
                    error.message ||
                    "An error occurred while enrolling in the event",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Join Private Event</CardTitle>
                <CardDescription>Enter the Event Details</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleEnroll} className="flex flex-col gap-4">
                    <Input
                        placeholder="Enter Event Code..."
                        value={eventCode}
                        onChange={(e) => setEventCode(e.target.value)}
                        disabled={loading}
                    />
                    <Button
                        className="w-full text-white"
                        disabled={loading || !eventCode.trim()}
                    >
                        {loading ? "Enrolling..." : "Enroll"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

export default CardPrivateEvent
