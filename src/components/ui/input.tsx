import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string
    startContent?: React.ReactNode
    endContent?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    (
        {
            className,
            type,
            containerClassName,
            startContent,
            endContent,
            ...props
        },
        ref,
    ) => {
        return (
            <div
                className={cn(
                    "input-wrapper relative rounded-full",
                    containerClassName,
                )}
            >
                {startContent && (
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center pointer-events-none text-muted-foreground">
                        {startContent}
                    </div>
                )}
                <input
                    type={type}
                    className={cn(
                        "input-field flex w-full rounded-full border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-50 transition-colors",
                        startContent && "pl-10",
                        endContent && "pr-10",
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                {endContent && (
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 flex items-center text-muted-foreground">
                        {endContent}
                    </div>
                )}
                <span className="focus-border">
                    <i></i>
                </span>
            </div>
        )
    },
)
Input.displayName = "Input"

export { Input }
