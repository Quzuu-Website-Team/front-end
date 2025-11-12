// src/components/Providers.tsx
"use client"

import React from "react"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/contexts/AuthContext"
import { TanstackProvider } from "./TanstackProvider"

interface ProvidersProps {
    children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
    return (
        <TanstackProvider>
            <SessionProvider>
                <AuthProvider>{children}</AuthProvider>
            </SessionProvider>
        </TanstackProvider>
    )
}
