"use client"

import React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

type RegisterEventDialogProps = {
    isOpen: boolean
    eventTitle?: string
    onConfirm: () => void
    onCancel: () => void
    isLoading: boolean
}

const RegisterEventDialog = ({
    isOpen,
    onConfirm,
    onCancel,
    isLoading,
    eventTitle = "",
}: RegisterEventDialogProps) => (
    <Dialog open={isOpen} onOpenChange={onCancel}>
        <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => {
                if (isLoading) {
                    e.preventDefault()
                }
            }}
            preventClose={isLoading}
        >
            <DialogHeader>
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-tertiary-100">
                        <AlertCircle className="w-6 h-6 text-tertiary-600" />
                    </div>
                    <div>
                        <DialogTitle>Register {eventTitle}</DialogTitle>
                        <DialogDescription className="mt-1">
                            Are you sure you want to register for {eventTitle}?
                        </DialogDescription>
                    </div>
                </div>
            </DialogHeader>

            <DialogFooter className="gap-2">
                <Button
                    variant="outline"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="bg-primary hover:bg-primary-600"
                >
                    {isLoading ? "Loading..." : "Register"}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
)

export default RegisterEventDialog
