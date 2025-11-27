import {
    Academy,
    AcademyDetailResponse,
    AcademyListResponse,
    AcademyMaterialContent,
    AcademyMaterialContentResponse,
} from "@/types/academy"
import { useQuery } from "@tanstack/react-query"

export const ACADEMY_QUERY_KEY = "academy"

const getListAcademy = async (): Promise<AcademyListResponse> => {
    const response = await fetch("/dummyListAcademy.json").then((res) =>
        res.json(),
    )
    return response
}

const getAcademyMaterials = async (
    slug: string,
): Promise<AcademyDetailResponse> => {
    const response = await fetch(`/dummyAcademyDetail.json`).then((res) =>
        res.json(),
    )
    return response
}

const getAcademyMaterialContent = async (
    academySlug: string,
    materialSlug: string,
    order: number,
): Promise<AcademyMaterialContentResponse> => {
    // remove when using real API
    if (!materialSlug || order === undefined) {
        throw new Error("Invalid parameters")
    }
    const response = await fetch(`/dummyAcademyMaterialContent.json`).then(
        async (res) => {
            // replace all this with return res.json() when real API call available
            const data = await res.json()
            const content = data.data.find(
                (content: any) =>
                    content.material_slug === materialSlug &&
                    content.order === order,
            )

            if (!content) {
                throw new Error("Content not found")
            }
            return {
                ...data,
                data: content,
            }
        },
    )
    return response
}

export const useGetListAcademy = () => {
    return useQuery<AcademyListResponse, Error, Academy[]>({
        queryKey: [ACADEMY_QUERY_KEY, "list"],
        queryFn: getListAcademy,
        select: (response) => response.data,
    })
}

export const useGetAcademyMaterials = (slug: string) => {
    return useQuery<AcademyDetailResponse, Error, Academy>({
        queryKey: [ACADEMY_QUERY_KEY, "detail", slug],
        queryFn: () => getAcademyMaterials(slug),
        select: (response) => response.data,
    })
}

export const useGetAcademyMaterialContent = (
    academySlug: string,
    materialSlug: string,
    order: number,
) => {
    return useQuery<
        AcademyMaterialContentResponse,
        Error,
        AcademyMaterialContent
    >({
        queryKey: [
            ACADEMY_QUERY_KEY,
            "material-content",
            academySlug,
            materialSlug,
            order,
        ],
        queryFn: () => {
            if (!materialSlug) {
                return new Promise(() => {}) // never resolve the promise
            }
            return getAcademyMaterialContent(academySlug, materialSlug, order)
        },
        select: (response) => response.data,
    })
}
