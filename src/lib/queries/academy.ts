import {
    Academy,
    AcademyDetailResponse,
    AcademyListResponse,
    AcademyMaterialContent,
    AcademyMaterialContentResponse,
} from "@/types/academy"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api"

export const ACADEMY_QUERY_KEY = "academy"

const getListAcademy = async (): Promise<AcademyListResponse> => {
    const response = await api.get<AcademyListResponse>("/academy")
    return response.data
}

const getAcademyMaterials = async (
    slug: string,
): Promise<AcademyDetailResponse> => {
    const response = await api.get<AcademyDetailResponse>(`/academy/${slug}`)
    return response.data
}

const getAcademyMaterialContent = async (
    academySlug: string,
    materialSlug: string,
    order: number,
): Promise<AcademyMaterialContentResponse> => {
    const response = await api.get<AcademyMaterialContentResponse>(
        `/academy/${academySlug}/${materialSlug}/${order}`,
    )
    return response.data
}

const postMarkContentAsRead = async (
    academySlug: string,
    materialSlug: string,
    order: number,
): Promise<Boolean> => {
    const response = await api.post<{ status: string }>(
        `/academy/${academySlug}/${materialSlug}/${order}`,
    )
    return response.data.status === "success"
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
        enabled: !!materialSlug, // only run if materialSlug is provided
    })
}

export const usePostMarkContentAsRead = (
    academySlug: string,
    materialSlug: string,
    order: number,
) => {
    const queryClient = useQueryClient()
    return useMutation<Boolean, Error>({
        mutationKey: [
            ACADEMY_QUERY_KEY,
            "mark-content-as-read",
            academySlug,
            materialSlug,
            order,
        ],
        mutationFn: () =>
            postMarkContentAsRead(academySlug, materialSlug, order),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ACADEMY_QUERY_KEY, "detail"],
            })
        },
    })
}
