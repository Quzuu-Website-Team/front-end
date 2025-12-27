import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

// Configuration Variants
const circularProgressVariants = cva(
    "relative flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "text-slate-900 dark:text-slate-50",
                primary: "text-primary",
                secondary: "text-secondary",
                tertiary: "text-tertiary", // Ensure this color exists in your Tailwind config
                destructive: "text-destructive",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

interface CircularProgressProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof circularProgressVariants> {
    progress: number // 0 - 100
    strokeWidth?: number
    children?: React.ReactNode
    showLabel?: boolean
}

const CircularProgress = React.forwardRef<
    HTMLDivElement,
    CircularProgressProps
>(
    (
        {
            className,
            variant,
            progress,
            children,
            strokeWidth = 10,
            showLabel = false,
            ...props
        },
        ref,
    ) => {
        // Normalize value to keep it between 0-100
        const value = Math.min(100, Math.max(0, progress))

        // Circle Geometry Constants
        const radius = 45
        const circumference = 2 * Math.PI * radius

        // Calculate offset based on percentage
        // Dashoffset: The distance of the dashed line. Larger offset means less line is visible.
        const dashOffset = circumference - (value / 100) * circumference

        return (
            <div
                ref={ref}
                role="progressbar"
                aria-valuenow={value}
                aria-valuemin={0}
                aria-valuemax={100}
                className={cn(circularProgressVariants({ variant }), className)}
                {...props}
            >
                {/* SVG Container: ViewBox 0 0 100 100 facilitates scaling */}
                <svg
                    className="h-full w-full -rotate-90 transform transition-all duration-300 ease-in-out"
                    viewBox="0 0 100 100"
                >
                    {/* Background Circle (Track) */}
                    <circle
                        className="text-slate-200 dark:text-slate-800"
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                    />

                    {/* Foreground Circle (Indicator) */}
                    <circle
                        className="transition-all duration-500 ease-out"
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r={radius}
                        cx="50"
                        cy="50"
                        style={{
                            strokeDasharray: circumference,
                            strokeDashoffset: dashOffset,
                        }}
                    />
                </svg>

                {/* Optional: Label Text in the Center */}
                {(showLabel || children) && (
                    <div className="absolute inset-0 flex items-center justify-center font-semibold select-none">
                        {children ? children : `${Math.round(value)}%`}
                    </div>
                )}
            </div>
        )
    },
)
CircularProgress.displayName = "CircularProgress"

export { CircularProgress }
