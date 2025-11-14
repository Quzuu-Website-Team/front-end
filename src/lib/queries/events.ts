import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
    EventListResponse,
    EventData,
    EventDetailResponse,
    RegisterEventResponse,
} from "@/types/events"
import {
    AnswerAttemptPayload,
    AnswerQuestionResponse,
    Attempt,
    AttemptDetailResponse,
    ExamListItem,
    ExamListResponse,
    SubmitAttemptResponse,
} from "@/types/attempt"

// query key
export const EVENTS_QUERY_KEY = "events"

const getListEvent = async (): Promise<EventListResponse> => {
    const response = await api.get<EventListResponse>("/events")
    return response.data
}

const getDetailEvent = async (slug: string): Promise<EventDetailResponse> => {
    const response = await api.get<EventDetailResponse>(`/events/${slug}`)
    return response.data
}

const registerEvent = async (
    eventCode: string,
): Promise<RegisterEventResponse> => {
    const response = await api.post<RegisterEventResponse>(
        "/events/register-event",
        {
            event_code: eventCode,
        },
    )
    return response.data
}

const getListEventExam = async (slug: string): Promise<ExamListResponse> => {
    const response = await api.get<ExamListResponse>(`/events/${slug}/exam`)
    return response.data
}

const getAttemptEventExam = async (
    eventSlug: string,
    examSlug: string,
): Promise<AttemptDetailResponse> => {
    const response = await api.get<AttemptDetailResponse>(
        `/events/${eventSlug}/exam/${examSlug}/attempt`,
    )
    return response.data
}

const postAnswerEventExam = async (
    eventSlug: string,
    attemptId: string,
    payload: AnswerAttemptPayload,
): Promise<AnswerQuestionResponse> => {
    const response = await api.post<AnswerQuestionResponse>(
        `/events/${eventSlug}/exam/${attemptId}/answer_question`,
        payload,
    )
    return response.data
}

const postAnswerEventExamFile = async (
    eventSlug: string,
    attemptId: string,
    payload: AnswerAttemptPayload,
): Promise<AnswerQuestionResponse> => {
    const formData = new FormData()
    formData.append("file", payload.answer[0])
    formData.append("question_id", payload.question_id)
    const response = await api.post<AnswerQuestionResponse>(
        `/events/${eventSlug}/exam/${attemptId}/answer_question`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } },
    )
    return response.data
}

const postSubmitEventExam = async (
    eventSlug: string,
    attemptId: string,
): Promise<SubmitAttemptResponse> => {
    const response = await api.post<SubmitAttemptResponse>(
        `/events/${eventSlug}/exam/${attemptId}/submit`,
    )
    return response.data
}

export const useGetListEvent = () => {
    return useQuery<EventListResponse, Error, EventData[]>({
        queryKey: [EVENTS_QUERY_KEY, "list"],
        queryFn: getListEvent,
        select: (response) => response.data,
    })
}

export const useGetDetailEvent = (slug: string) => {
    return useQuery<EventDetailResponse, Error, EventData>({
        queryKey: [EVENTS_QUERY_KEY, "detail", slug],
        queryFn: () => getDetailEvent(slug),
        select: (response) => ({
            ...response.data.Data,
            register_status: !!response.data.register_status,
        }),
        staleTime: 1000 * 60 * 1, // 1 minute
    })
}

export const useRegisterEvent = (eventCode: string) => {
    return useMutation<RegisterEventResponse, Error>({
        mutationKey: [EVENTS_QUERY_KEY, "register", eventCode],
        mutationFn: () => registerEvent(eventCode),
    })
}

export const useGetListEventExam = (slug: string) => {
    return useQuery<ExamListResponse, Error, ExamListItem[]>({
        queryKey: [EVENTS_QUERY_KEY, "exam", slug],
        queryFn: () => getListEventExam(slug),
        select: (response) => response.data,
    })
}

export const useGetAttemptEventExam = (eventSlug: string, examSlug: string) => {
    return useQuery<AttemptDetailResponse, Error, Attempt>({
        queryKey: [EVENTS_QUERY_KEY, "get_attempt", eventSlug, examSlug],
        queryFn: () => getAttemptEventExam(eventSlug, examSlug),
        select: (response) => response.data,
    })
}

export const usePostAnswerEventExam = (
    eventSlug: string,
    attemptId: string,
) => {
    return useMutation<AnswerQuestionResponse, Error, AnswerAttemptPayload>({
        mutationKey: [EVENTS_QUERY_KEY, "post_answer", eventSlug, attemptId],
        mutationFn: (payload: AnswerAttemptPayload) =>
            postAnswerEventExam(eventSlug, attemptId, payload),
    })
}

export const usePostAnswerEventExamFile = (
    eventSlug: string,
    attemptId: string,
) => {
    return useMutation<AnswerQuestionResponse, Error, AnswerAttemptPayload>({
        mutationKey: [
            EVENTS_QUERY_KEY,
            "post_answer_file",
            eventSlug,
            attemptId,
        ],
        mutationFn: (payload: AnswerAttemptPayload) =>
            postAnswerEventExamFile(eventSlug, attemptId, payload),
    })
}

export const usePostSubmitEventExam = (
    eventSlug: string,
    attemptId: string,
) => {
    return useMutation<SubmitAttemptResponse, Error>({
        mutationKey: [EVENTS_QUERY_KEY, "post_submit", eventSlug, attemptId],
        mutationFn: () => postSubmitEventExam(eventSlug, attemptId),
    })
}
