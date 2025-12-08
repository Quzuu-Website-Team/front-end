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
import { usePostJoinAcademy } from "@/lib/queries/academy"
import { zodResolver } from "@hookform/resolvers/zod"

import React, { useState } from "react"
import { useForm } from "react-hook-form"
import z from "zod"

const FormSchema = z.object({
    code: z
        .string()
        .length(6, "Code must be exactly 6 characters")
        .regex(/^[A-Z0-9]{6}$/, {
            message: "Code must contain only uppercase letters and numbers.",
        }),
})

export default function RegisterPrivateAcademy() {
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false)
    const { mutate: registerAcademy, isPending } = usePostJoinAcademy()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            code: "",
        },
    })

    const onRegisterAcademy = (data: z.infer<typeof FormSchema>) => {
        registerAcademy(data.code, {
            onSuccess: () => {
                toast({
                    title: "Enrollment Successful",
                    description:
                        "You have successfully joined the class. Happy learning!",
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
                Enroll Private Learning
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
                        <DialogTitle>Enroll Private Learning</DialogTitle>
                        <DialogDescription>
                            Please fill the Code to enroll a private learning.
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onRegisterAcademy)}
                            className="space-y-6"
                        >
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="Enter 6-digit code"
                                                type="text"
                                                aria-label="Academy Access Code"
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
