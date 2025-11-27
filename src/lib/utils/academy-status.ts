import { AcademyStatus } from "@/types/academy"

export const mapAcademyStatus = (
    status: AcademyStatus,
): { label: string; variant: "success" | "info" | "default" } => {
    switch (status) {
        case "FINISHED":
            return { label: "Finished", variant: "success" }
        case "IN_PROGRESS":
            return { label: "In Progress", variant: "info" }
        case "NOT_STARTED":
            return { label: "Not Started", variant: "default" }
        default:
            return { label: "Unknown", variant: "default" }
    }
}
