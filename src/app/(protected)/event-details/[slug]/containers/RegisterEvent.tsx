"use client"

import { Button } from "@/components/ui/button"
import { useGetDetailEvent, useRegisterEvent } from "@/lib/queries/events"
import RegisterEventDialog from "./RegisterEventDialog"
import { useState } from "react"
import { toast } from "@/hooks/use-toast"

export default function RegisterEvent({ slug }: { slug: string }) {
    const { data: eventDetail, isLoading: loadingDetailEvent } =
        useGetDetailEvent(slug)

    const { isPending: loadingRegisterEvent, mutate: postRegisterEvent } =
        useRegisterEvent()

    const [openRegisterDialog, setOpenRegisterDialog] = useState(false)

    const onRegisterEvent = () => {
        postRegisterEvent(eventDetail?.event_code || "", {
            onSuccess: () => {
                setOpenRegisterDialog(false)
                toast({
                    title: "Successfully registered!",
                    description: `You have successfully registered for the event "${eventDetail?.title}"`,
                    variant: "success",
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
