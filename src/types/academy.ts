import { ListData, ResponseData } from "./common"

export type AcademyStatus = "NOT_STARTED" | "IN_PROGRESS" | "FINISHED"

// Progress Sub-Interfaces
export interface AcademyProgress {
    id: string
    account_id: string
    academy_id: string
    status: AcademyStatus
    progress: number
    total_completed_materials: number
    completed_at: string | null
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
    register_status: boolean
    image_url?: string
    academy_progress?: AcademyProgress
    materials?: AcademyMaterial[]
}

export interface AcademyMaterial {
    id: string
    title: string
    slug: string
    order: number
    contents_count: number
    academy_material_progresses?: AcademyMaterialProgress
    contents?: AcademyMaterialContent[]
}

export interface AcademyMaterialContent {
    id: string
    material_id: string
    title: string
    order: number
    contents: string
    status: AcademyStatus // For list materials
    academy_content_progresses?: AcademyContentProgress
}

export interface AcademyListResponse extends ListData<Academy> {}
export interface AcademyDetailResponse extends ResponseData<Academy> {}
export interface AcademyMaterialContentResponse
    extends ResponseData<AcademyMaterialContent> {}
