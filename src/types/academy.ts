import { ListData, ResponseData } from "./common"

export interface Academy {
    id: string
    title: string
    slug: string
    description: string
    progress: number
    total_materials: number
    image_url: string | null
    status: "finished" | "in_progress" | "not_started"
}

export interface AcademyDetail {
    academy: Academy
    materials: AcademyMaterial[]
}

export interface AcademyMaterial {
    id: string
    academy_id: string
    title: string
    slug: string
    description: string
}

export interface AcademyMaterialDetail {
    material: AcademyMaterial
    contents: AcademyContent[]
}

export interface AcademyContent {
    id: string
    academy_material_id: string
    title: string
    order: number
    contents: string
}

export interface AcademyListResponse extends ListData<Academy> {}
export interface AcademyDetailResponse extends ResponseData<AcademyDetail> {}
export interface AcademyMaterialDetailResponse
    extends ResponseData<AcademyMaterialDetail> {}
