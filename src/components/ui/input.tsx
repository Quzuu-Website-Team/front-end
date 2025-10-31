import * as React from "react"

import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, containerClassName, ...props }, ref) => {
        return (
            <div
                className={cn(
                    "input-wrapper relative rounded-full",
                    containerClassName,
                )}
            >
                <input
                    type={type}
                    className={cn(
                        "input-field flex w-full rounded-full border border-input bg-background px-4 py-3 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary-50 transition-colors",
                        className,
                    )}
                    ref={ref}
                    {...props}
                />
                <span className="focus-border">
                    <i></i>
                </span>
            </div>
        )
    },
)
Input.displayName = "Input"

export { Input }
