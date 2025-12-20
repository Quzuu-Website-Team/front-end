import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { useRegisterEvent } from "@/lib/queries/events"
import { zodResolver } from "@hookform/resolvers/zod"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const FormSchema = z.object({
    code: z
        .string()
        .min(6, "Minimum length is 6 characters")
        .max(12, "Maximum length is 12 characters")
        .regex(/^[A-Za-z0-9]{6,12}$/, {
            message: "Code must contain only letters and numbers.",
        }),
})

export default function RegisterPrivateEvent() {
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false)
    const { mutate: registerEvent, isPending } = useRegisterEvent()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: "",
        },
    })

    const onRegisterEvent = (data: z.infer<typeof FormSchema>) => {
        registerEvent(data.code, {
            onSuccess: () => {
                toast({
                    title: "Enrollment Successful",
                    description: "You have successfully joined the event.",
                    variant: "success",
                })
                setOpenRegisterDialog(false)
                form.reset()
            },
            onError: () => {
                form.setError("code", {
                    type: "manual",
                    message:
                        "The code provided is incorrect. Please check and try again.",
                })
                toast({
                    title: "Invalid Access Code",
                    description:
                        "The code provided is incorrect. Please check and try again.",
                    variant: "destructive",
                })
            },
        })
    }
    return (
        <div className="max-md:w-full">
            <Button
                className="w-full"
                onClick={() => setOpenRegisterDialog(true)}
            >
                Enroll Private Event
            </Button>

            <Dialog
                open={openRegisterDialog}
                onOpenChange={setOpenRegisterDialog}
            >
                <DialogContent
                    className="sm:max-w-md"
                    onInteractOutside={(e) => {
                        if (isPending) {
                            e.preventDefault()
                        }
                    }}
                    preventClose={isPending}
                >
                    <DialogHeader>
                        <DialogTitle>Enroll Private Event</DialogTitle>
                        <DialogDescription>
                            Please fill the Code to enroll a private event.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onRegisterEvent)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter access code"
                                                type="text"
                                                aria-label="Event Access Code"
                                                required
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isPending || !form.formState.isValid}
                                isLoading={isPending}
                            >
                                {isPending ? "Enrolling..." : "Enroll"}
                            </Button>
                        </form>
                    </Form>

                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpenRegisterDialog(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
