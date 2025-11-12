"use client"

import { Button } from "@/components/ui/button"
import { useGetDetailEvent, useRegisterEvent } from "@/lib/queries/events"
import RegisterEventDialog from "./RegisterEventDialog"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { useQueryClient } from "@tanstack/react-query"

export default function RegisterEvent({ slug }: { slug: string }) {
    const queryClient = useQueryClient()
    const { data: eventDetail, isLoading: loadingDetailEvent } =
        useGetDetailEvent(slug)

    const { isPending: loadingRegisterEvent, mutate: postRegisterEvent } =
        useRegisterEvent(eventDetail?.event_code || "")

    const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

    const onRegisterEvent = () => {
        postRegisterEvent(undefined, {
            onSuccess: (response) => {
                setOpenRegisterDialog(false)
                toast({
                    title: "Successfully registered!",
                    description:
                        response.message ||
                        `You have successfully registered for the event "${eventDetail?.title}"`,
                })
                queryClient.invalidateQueries({
                    queryKey: ["events", "detail", slug],
                })
            },
            onError: (error) => {
                setOpenRegisterDialog(false)
                toast({
                    variant: "destructive",
                    title: "Registration failed",
                    description:
                        error.message ||
                        "An error occurred while registering for the event.",
                })
            },
        })
    }

    if (loadingDetailEvent || !eventDetail) {
        return (
            <div className="animate-pulse h-10 w-full bg-gray-200 rounded-full"></div>
        )
    }

    if (eventDetail.register_status) {
        return <></>
    }

    return (
        <div>
            <Button
                className="w-full"
                onClick={() => setOpenRegisterDialog(true)}
            >
                Register Event
            </Button>

            <RegisterEventDialog
                isOpen={openRegisterDialog}
                isLoading={loadingRegisterEvent}
                eventTitle={eventDetail.title}
                onConfirm={onRegisterEvent}
                onCancel={() => setOpenRegisterDialog(false)}
            />
        </div>
    )
}
