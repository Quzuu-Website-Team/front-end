export const mapAcademyStatus = (
    status: "finished" | "in_progress" | "not_started",
): { label: string; variant: "success" | "info" | "default" } => {
    switch (status) {
        case "finished":
            return { label: "Finished", variant: "success" }
        case "in_progress":
            return { label: "In Progress", variant: "info" }
        case "not_started":
            return { label: "Not Started", variant: "default" }
        default:
            return { label: "Unknown", variant: "default" }
    }
}
