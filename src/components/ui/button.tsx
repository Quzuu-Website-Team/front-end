import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useRipple } from "@/hooks/use-ripple"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 relative overflow-hidden",
    {
        variants: {
            variant: {
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/90 disabled:hover:bg-primary",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:hover:bg-destructive",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground disabled:hover:bg-accent",
                "primary-outline":
                    "border border-primary text-primary hover:bg-primary-50 disabled:hover:bg-primary-50",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:hover:bg-secondary",
                ghost: "hover:bg-accent hover:text-accent-foreground bg-muted text-slate-800 hover:bg-slate-200 hover:shadow",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-full px-3",
                lg: "h-11 rounded-full px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    },
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
    iconLeft?: React.ReactNode
    iconRight?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant,
            size,
            asChild = false,
            onClick,
            iconLeft,
            iconRight,
            children,
            ...props
        },
        ref,
    ) => {
        const { createRipple } = useRipple()
        const Comp = asChild ? Slot : "button"

        const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
            createRipple(event)
            onClick?.(event)
        }
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                onClick={handleClick}
                {...props}
            >
                {iconLeft && (
                    <span className="mr-2 inline-flex items-center">
                        {iconLeft}
                    </span>
                )}
                {children}
                {iconRight && (
                    <span className="ml-2 inline-flex items-center">
                        {iconRight}
                    </span>
                )}
            </Comp>
        )
    },
)
Button.displayName = "Button"

export { Button, buttonVariants }
