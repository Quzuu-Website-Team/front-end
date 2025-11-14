"use client"

import React, { memo } from "react"
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

type SubmitConfirmDialogProps = {
    isOpen: boolean
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
    isTimeout?: boolean
}

const SubmitConfirmDialog = memo<SubmitConfirmDialogProps>(
    ({ isOpen, onConfirm, onCancel, isLoading = false, isTimeout = false }) => (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <DialogTitle>
                                {isTimeout
                                    ? "Session Timeout"
                                    : "Submit Answers?"}
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                {isTimeout
                                    ? "Your time is up. Submitting answers..."
                                    : "Are you sure you want to submit your answers now?"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {!isTimeout && (
                    <div className="space-y-3 py-4">
                        <p className="text-sm text-slate-600">
                            Once submitted, you won&apos;t be able to change
                            your answers anymore.
                        </p>
                    </div>
                )}

                <DialogFooter className="gap-3">
                    {!isTimeout && (
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="bg-primary hover:bg-primary-600"
                    >
                        {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
)

SubmitConfirmDialog.displayName = "SubmitConfirmDialog"

export default SubmitConfirmDialog
