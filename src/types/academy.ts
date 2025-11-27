import { ListData, ResponseData } from "./common"

export type AcademyStatus = "NOT_STARTED" | "IN_PROGRESS" | "FINISHED"

// Progress Sub-Interfaces
export interface AcademyProgress {
    id: string
    status: AcademyStatus
    progress: number
    total_completed_materials: number
    completed_at: string
}

export interface AcademyMaterialProgress {
    id: string
    status: AcademyStatus
    progress: number
    total_completed_contents: number
}

export interface AcademyContentProgress {
    id: string
    status: AcademyStatus
    completed_at: string
}

// Main Entities
export interface Academy {
    id: string
    title: string
    description: string
    slug: string
    materials_count: number
    image_url?: string
    // Nested Object mapped from JSON key "academy_progresses"
    academy_progresses?: AcademyProgress
    data: AcademyMaterial[]
}

export interface AcademyMaterial {
    id: string
    title: string
    slug: string
    order: number
    contents_count: number
    // Nested Object mapped from JSON key "academy_material_progresses"
    academy_material_progresses?: AcademyMaterialProgress
    contents?: AcademyMaterialContent[]
}

export interface AcademyMaterialContent {
    id: string
    material_id: string
    title: string
    order: number
    contents: string
    // Nested Object mapped from JSON key "academy_content_progresses"
    academy_content_progresses?: AcademyContentProgress
}

export interface AcademyListResponse extends ListData<Academy> {}
export interface AcademyDetailResponse extends ResponseData<Academy> {}
export interface AcademyMaterialContentResponse
    extends ResponseData<AcademyMaterialContent> {}
