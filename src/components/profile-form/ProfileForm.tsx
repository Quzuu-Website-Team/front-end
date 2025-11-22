"use client"

import React, { useEffect } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import ProfileFormSkeleton from "./ProfileFormSkeleton"

// Define the form schema
export const ProfileFormSchema = z.object({
    full_name: z
        .string()
        .min(2, { message: "Name must be at least 2 characters." }),
    school_name: z
        .string()
        .min(2, { message: "School name must be at least 2 characters." }),
    province: z
        .string()
        .min(2, { message: "Province must be at least 2 characters." }),
    city: z.string().min(2, { message: "City must be at least 2 characters." }),
    phone_number: z
        .string()
        .regex(/^\d+$/, {
            message: "Phone number must contain only digits.",
        })
        .min(10, { message: "Phone number must be at least 10 digits." }),
    avatar: z.string().default("avatar.png"),
})

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>

interface ProfileFormProps {
    defaultValues?: Partial<ProfileFormValues>
    onSubmit: (data: ProfileFormValues) => Promise<void>
    loading?: boolean
    submitButtonText?: string
    showActions?: boolean
    onCancel?: () => void
    isInitialLoading?: boolean
}

export default function ProfileForm({
    defaultValues,
    onSubmit,
    loading = false,
    submitButtonText = "Save Profile",
    showActions = false,
    onCancel,
    isInitialLoading = false,
}: ProfileFormProps) {
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(ProfileFormSchema),
        defaultValues: {
            full_name: defaultValues?.full_name || "",
            school_name: defaultValues?.school_name || "",
            province: defaultValues?.province || "",
            city: defaultValues?.city || "",
            phone_number: defaultValues?.phone_number || "",
            avatar: defaultValues?.avatar || "avatar.png",
        },
    })

    // Update form when defaultValues change
    useEffect(() => {
        if (defaultValues) {
            form.reset({
                full_name: defaultValues.full_name || "",
                school_name: defaultValues.school_name || "",
                province: defaultValues.province || "",
                city: defaultValues.city || "",
                phone_number: defaultValues.phone_number || "",
                avatar: defaultValues.avatar || "avatar.png",
            })
        }
    }, [defaultValues, form])

    if (isInitialLoading) {
        return <ProfileFormSkeleton />
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Your Full Name"
                                    {...field}
                                    disabled={loading}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="phone_number"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Phone Number</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="081234567890"
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="school_name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>School/Institution</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="School or Institution Name"
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="city"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="City"
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="province"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Province</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Province"
                                        {...field}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-between pt-4">
                    {showActions && onCancel && (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className={!showActions ? "w-full" : ""}
                    >
                        {loading ? "Saving..." : submitButtonText}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
