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
}

const SubmitConfirmDialog = memo<SubmitConfirmDialogProps>(
    ({ isOpen, onConfirm, onCancel, isLoading = false }) => (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                            <DialogTitle>Submit Answers?</DialogTitle>
                            <DialogDescription className="mt-1">
                                Pastikan semua jawaban sudah benar sebelum
                                submit.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-3 py-4">
                    <p className="text-sm text-slate-600">
                        Setelah submit, Anda tidak bisa mengubah jawaban lagi.
                    </p>
                </div>

                <DialogFooter className="gap-3">
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
                        {isLoading ? "Submitting..." : "Submit"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
)

SubmitConfirmDialog.displayName = "SubmitConfirmDialog"

export default SubmitConfirmDialog
