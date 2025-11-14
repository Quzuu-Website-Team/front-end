import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-gray bg-gray-100 text-gray-600 hover:bg-gray-200",
                secondary:
                    "border-secondary bg-secondary-100 text-secondary hover:bg-secondary-200",
                tertiary:
                    "border-tertiary bg-tertiary-100 text-tertiary hover:bg-tertiary-200",
                destructive:
                    "border-destructive bg-destructive-100 text-destructive hover:bg-destructive-200",
                outline: "text-foreground",
                success:
                    "border-green-500 bg-green-100 text-green-700 hover:bg-green-200",
                warning:
                    "border-yellow-500 bg-yellow-100 text-yellow-700 hover:bg-yellow-200",
                info: "border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-200",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
