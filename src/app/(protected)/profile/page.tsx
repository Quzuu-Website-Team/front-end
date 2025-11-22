"use client"

import React, { useMemo, useState } from "react"
import { toast } from "@/hooks/use-toast"
import { updateUserProfile, UserProfileUpdateData } from "@/lib/api"
import { useAuth } from "@/contexts/AuthContext"
import ProfileForm, {
    ProfileFormValues,
} from "@/components/profile-form/ProfileForm"

export default function CompleteProfile() {
    const [loading, setLoading] = useState(false)
    const { user, isLoading, refreshUserData } = useAuth() // 🆕 Add isLoading from context

    // Format user data for form
    const defaultValues: Partial<ProfileFormValues> = useMemo(
        () => ({
            full_name: user?.fullName || "",
            school_name: user?.schoolName || "",
            province: user?.province || "",
            city: user?.city || "",
            phone_number: user?.phoneNumber?.replace(/^\+62/, "0") || "",
            avatar: user?.avatar || "avatar.png",
        }),
        [user],
    )

    async function handleSubmit(data: ProfileFormValues) {
        setLoading(true)

        try {
            console.log("🚀 Starting profile update process...")

            // Format phone number
            let formattedPhoneNumber = data.phone_number
            if (formattedPhoneNumber.startsWith("0")) {
                formattedPhoneNumber = `+62${formattedPhoneNumber.substring(1)}`
            } else if (!formattedPhoneNumber.startsWith("+")) {
                formattedPhoneNumber = `+62${formattedPhoneNumber}`
            }

            const profileData: UserProfileUpdateData = {
                full_name: data.full_name,
                school_name: data.school_name,
                province: data.province,
                city: data.city,
                phone_number: formattedPhoneNumber,
                avatar: data.avatar || "avatar.png",
            }

            console.log("📡 Calling API...")
            await updateUserProfile(profileData)
            console.log("✅ API call successful")

            toast({
                title: "Profile Updated",
                description:
                    "Your profile details have been saved successfully.",
            })
            await refreshUserData()
        } catch (error: any) {
            console.error("❌ Error updating profile:", error)
            toast({
                variant: "destructive",
                title: "Failed to Update Profile",
                description:
                    error.message ||
                    "An error occurred while updating your profile.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="container min-h-screen py-10">
            <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md">
                <h1 className="text-2xl font-bold mb-6">
                    Complete Your Profile
                </h1>
                <p className="text-gray-600 mb-8">
                    Please provide some additional information to complete your
                    profile. This will help us personalize your experience.
                </p>

                <ProfileForm
                    defaultValues={defaultValues}
                    onSubmit={handleSubmit}
                    loading={loading}
                    submitButtonText="Save Profile"
                    isInitialLoading={isLoading} // 🆕 Pass loading state
                />
            </div>
        </main>
    )
}
