import {
    Academy,
    AcademyDetailResponse,
    AcademyListResponse,
    AcademyMaterialContent,
    AcademyMaterialContentResponse,
} from "@/types/academy"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "../api"
import {
    AnswerAttemptPayload,
    AnswerQuestionResponse,
    Attempt,
    AttemptDetailResponse,
    SubmitAttemptResponse,
} from "@/types/attempt"

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

const postJoinAcademy = async (academyCode: string): Promise<Boolean> => {
    const response = await api.post<{ status: string }>(`/academy/join`, {
        code: academyCode,
    })
    return response.data.status === "success"
}

// EXAM
const getAttemptAcademyExam = async (
    academySlug: string,
    examSlug: string,
): Promise<AttemptDetailResponse> => {
    const response = await api.get<AttemptDetailResponse>(
        `/academys/${academySlug}/exam/${examSlug}/attempt`,
    )
    return response.data
}

const postAnswerAcademyExam = async (
    academySlug: string,
    attemptId: string,
    payload: AnswerAttemptPayload,
): Promise<AnswerQuestionResponse> => {
    const response = await api.post<AnswerQuestionResponse>(
        `/academys/${academySlug}/exam/${attemptId}/answer_question`,
        payload,
    )
    return response.data
}

const postAnswerAcademyExamFile = async (
    academySlug: string,
    attemptId: string,
    payload: AnswerAttemptPayload,
): Promise<AnswerQuestionResponse> => {
    const formData = new FormData()
    formData.append("file", payload.answer[0])
    formData.append("question_id", payload.question_id)
    const response = await api.post<AnswerQuestionResponse>(
        `/academys/${academySlug}/exam/${attemptId}/answer_question`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
    )
    return response.data
}

const postSubmitAcademyExam = async (
    academySlug: string,
    attemptId: string,
): Promise<SubmitAttemptResponse> => {
    const response = await api.post<SubmitAttemptResponse>(
        `/academys/${academySlug}/exam/${attemptId}/submit`,
    )
    return response.data
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
    enableQuery: boolean = false,
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
            return getAcademyMaterialContent(academySlug, materialSlug, order)
        },
        select: (response) => response.data,
        enabled: enableQuery, // only run if enabled
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

export const usePostJoinAcademy = () => {
    const queryClient = useQueryClient()
    return useMutation<Boolean, Error, string>({
        mutationKey: [ACADEMY_QUERY_KEY, "join"],
        mutationFn: (academyCode: string) => postJoinAcademy(academyCode),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [ACADEMY_QUERY_KEY],
            })
        },
    })
}

export const useGetAttemptAcademyExam = (
    academySlug: string,
    examSlug: string,
) => {
    return useQuery<AttemptDetailResponse, Error, Attempt>({
        queryKey: [ACADEMY_QUERY_KEY, "get_attempt", academySlug, examSlug],
        queryFn: () => getAttemptAcademyExam(academySlug, examSlug),
        select: (response) => response.data,
    })
}

export const usePostAnswerAcademyExam = (
    academySlug: string,
    attemptId: string,
) => {
    return useMutation<AnswerQuestionResponse, Error, AnswerAttemptPayload>({
        mutationKey: [ACADEMY_QUERY_KEY, "post_answer", academySlug, attemptId],
        mutationFn: (payload: AnswerAttemptPayload) =>
            postAnswerAcademyExam(academySlug, attemptId, payload),
    })
}

export const usePostAnswerAcademyExamFile = (
    academySlug: string,
    attemptId: string,
) => {
    return useMutation<AnswerQuestionResponse, Error, AnswerAttemptPayload>({
        mutationKey: [
            ACADEMY_QUERY_KEY,
            "post_answer_file",
            academySlug,
            attemptId,
        ],
        mutationFn: (payload: AnswerAttemptPayload) =>
            postAnswerAcademyExamFile(academySlug, attemptId, payload),
    })
}

export const usePostSubmitAcademyExam = (
    academySlug: string,
    attemptId: string,
) => {
    return useMutation<SubmitAttemptResponse, Error>({
        mutationKey: [ACADEMY_QUERY_KEY, "post_submit", academySlug, attemptId],
        mutationFn: () => postSubmitAcademyExam(academySlug, attemptId),
    })
}
