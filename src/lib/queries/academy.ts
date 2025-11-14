import {
    Academy,
    AcademyDetail,
    AcademyDetailResponse,
    AcademyListResponse,
    AcademyMaterialDetail,
    AcademyMaterialDetailResponse,
} from "@/types/academy"
import { useQuery } from "@tanstack/react-query"

export const ACADEMY_QUERY_KEY = "academy"

const getListAcademy = async (): Promise<AcademyListResponse> => {
    const response = await fetch("/dummyListAcademy.json").then((res) =>
        res.json(),
    )
    return response
}

const getDetailAcademy = async (
    slug: string,
): Promise<AcademyDetailResponse> => {
    const response = await fetch(`/dummyAcademyDetail.json`).then((res) =>
        res.json(),
    )
    return response
}

const getAcademyMaterialDetail = async (
    academySlug: string,
    materialSlug: string,
): Promise<AcademyMaterialDetailResponse> => {
    const response = await fetch(`/dummyAcademyMaterial.json`).then((res) =>
        res.json(),
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

export const useGetDetailAcademy = (slug: string) => {
    return useQuery<AcademyDetailResponse, Error, AcademyDetail>({
        queryKey: [ACADEMY_QUERY_KEY, "detail", slug],
        queryFn: () => getDetailAcademy(slug),
        select: (response) => response.data,
    })
}

export const useGetAcademyMaterialDetail = (
    academySlug: string,
    materialSlug: string,
) => {
    return useQuery<
        AcademyMaterialDetailResponse,
        Error,
        AcademyMaterialDetail
    >({
        queryKey: [
            ACADEMY_QUERY_KEY,
            "material-detail",
            academySlug,
            materialSlug,
        ],
        queryFn: () => {
            if (!materialSlug) {
                return new Promise(() => {}) // never resolve the promise
            }
            return getAcademyMaterialDetail(academySlug, materialSlug)
        },
        select: (response) => response.data,
    })
}
