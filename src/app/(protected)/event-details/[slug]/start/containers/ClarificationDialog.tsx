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
import { Info } from "lucide-react"

type ClarificationDialogProps = {
    isOpen: boolean
    onConfirm: () => void
    onCancel: () => void
    isLoading?: boolean
}

const ClarificationDialog = memo<ClarificationDialogProps>(
    ({ isOpen, onConfirm, onCancel, isLoading = false }) => (
        <Dialog open={isOpen} onOpenChange={onCancel}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
                            <Info className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <DialogTitle>Clarification</DialogTitle>
                            <DialogDescription className="mt-1">
                                -
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

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

ClarificationDialog.displayName = "ClarificationDialog"

export default ClarificationDialog
