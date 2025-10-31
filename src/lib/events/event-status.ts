/**
 * Get event status based on start and end dates
 * @param startDate - Event start date
 * @param endDate - Event end date
 * @returns Event status object with label and variant
 */
export const getEventStatus = (
    startDate: string | Date,
    endDate: string | Date,
): {
    status: "upcoming" | "ongoing" | "ended"
    label: string
    variant: "tertiary" | "success" | "secondary"
} => {
    try {
        const now = new Date()
        const start = new Date(startDate)
        const end = new Date(endDate)

        if (now < start) {
            return {
                status: "upcoming",
                label: "Upcoming",
                variant: "secondary",
            }
        }

        if (now >= start && now <= end) {
            return {
                status: "ongoing",
                label: "Ongoing",
                variant: "tertiary",
            }
        }

        return {
            status: "ended",
            label: "Ended",
            variant: "success",
        }
    } catch (error) {
        console.error("Error getting event status:", error)
        return {
            status: "upcoming",
            label: "Unknown",
            variant: "secondary",
        }
    }
}
