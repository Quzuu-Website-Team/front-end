/**
 * Format date to user's local timezone
 * @param dateString - ISO date string or date string from API
 * @param options - Intl.DateTimeFormat options
 * @returns Formatted date string in user's timezone
 */
export const formatDateToLocal = (
    dateString: string | Date,
    options?: Intl.DateTimeFormatOptions,
): string => {
    if (!dateString) return "-"

    try {
        const date = new Date(dateString)

        // Check if date is valid
        if (isNaN(date.getTime())) {
            return "-"
        }

        const defaultOptions: Intl.DateTimeFormatOptions = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZoneName: "short",
            ...options,
        }

        return new Intl.DateTimeFormat("id-ID", defaultOptions).format(date)
    } catch (error) {
        console.error("Error formatting date:", error)
        return "-"
    }
}

/**
 * Format date without time
 * @param dateString - ISO date string or date string from API
 * @returns Formatted date string (DD MMM YYYY)
 */
export const formatDateOnly = (dateString: string | Date): string => {
    return formatDateToLocal(dateString, {
        year: "numeric",
        month: "short",
        day: "numeric",
    })
}

/**
 * Format date with time
 * @param dateString - ISO date string or date string from API
 * @returns Formatted date string (DD MMM YYYY, HH:MM)
 */
export const formatDateTime = (dateString: string | Date): string => {
    return formatDateToLocal(dateString, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    })
}

/**
 * Get relative time (e.g., "2 hours ago", "in 3 days")
 * @param dateString - ISO date string or date string from API
 * @returns Relative time string
 */
export const getRelativeTime = (dateString: string | Date): string => {
    if (!dateString) return "-"

    try {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor(
            (date.getTime() - now.getTime()) / 1000,
        )

        const rtf = new Intl.RelativeTimeFormat("id-ID", { numeric: "auto" })

        // Seconds
        if (Math.abs(diffInSeconds) < 60) {
            return rtf.format(diffInSeconds, "second")
        }

        // Minutes
        const diffInMinutes = Math.floor(diffInSeconds / 60)
        if (Math.abs(diffInMinutes) < 60) {
            return rtf.format(diffInMinutes, "minute")
        }

        // Hours
        const diffInHours = Math.floor(diffInMinutes / 60)
        if (Math.abs(diffInHours) < 24) {
            return rtf.format(diffInHours, "hour")
        }

        // Days
        const diffInDays = Math.floor(diffInHours / 24)
        if (Math.abs(diffInDays) < 30) {
            return rtf.format(diffInDays, "day")
        }

        // Months
        const diffInMonths = Math.floor(diffInDays / 30)
        if (Math.abs(diffInMonths) < 12) {
            return rtf.format(diffInMonths, "month")
        }

        // Years
        const diffInYears = Math.floor(diffInMonths / 12)
        return rtf.format(diffInYears, "year")
    } catch (error) {
        console.error("Error getting relative time:", error)
        return "-"
    }
}

/**
 * Check if date is in the past
 * @param dateString - ISO date string or date string from API
 * @returns true if date is in the past
 */
export const isPast = (dateString: string | Date): boolean => {
    try {
        const date = new Date(dateString)
        return date < new Date()
    } catch (error) {
        return false
    }
}

/**
 * Check if date is in the future
 * @param dateString - ISO date string or date string from API
 * @returns true if date is in the future
 */
export const isFuture = (dateString: string | Date): boolean => {
    try {
        const date = new Date(dateString)
        return date > new Date()
    } catch (error) {
        return false
    }
}

/**
 * Check if current time is between two dates
 * @param startDate - Start date
 * @param endDate - End date
 * @returns true if current time is between start and end
 */
export const isBetween = (
    startDate: string | Date,
    endDate: string | Date,
): boolean => {
    try {
        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)
        return now >= start && now <= end
    } catch (error) {
        return false
    }
}
