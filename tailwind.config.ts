import type { Config } from "tailwindcss"

const config = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
    prefix: "",
    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },
        screens: {
            sm: "640px",
            md: "768px",
            tablet: "900px",
            lg: "1024px",
            laptop: "1118px",
            xl: "1280px",
            "2xl": "1536px",
        },
        extend: {
            fontFamily: {
                sans: ["var(--font-inter)", "sans-serif"],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "#6e62e5",
                    foreground: "hsl(var(--primary-foreground))",
                    "50": "#eff1fe",
                    "100": "#e2e5fd",
                    "200": "#cbcffa",
                    "300": "#abb0f6",
                    "400": "#8c8aef",
                    "500": "#6e62e5",
                    "600": "#6851da",
                    "700": "#5a42c0",
                    "800": "#49389b",
                    "900": "#3f347b",
                    "950": "#261e48",
                },
                secondary: {
                    DEFAULT: "#cf35ff",
                    foreground: "hsl(var(--secondary-foreground))",
                    "50": "#fdf3ff",
                    "100": "#f8e6ff",
                    "200": "#f2cbff",
                    "300": "#eca3ff",
                    "400": "#e16cff",
                    "500": "#cf35ff",
                    "600": "#af14da",
                    "700": "#9b0dbe",
                    "800": "#810d9b",
                    "900": "#6c117e",
                    "950": "#480055",
                },
                tertiary: {
                    DEFAULT: "#1aa4dd",
                    "50": "#f1f9fe",
                    "100": "#e2f2fc",
                    "200": "#bee6f9",
                    "300": "#84d3f5",
                    "400": "#43bced",
                    "500": "#1aa4dd",
                    "600": "#0d85be",
                    "700": "#0c6998",
                    "800": "#0e597e",
                    "900": "#114b69",
                    "950": "#0c2f45",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
