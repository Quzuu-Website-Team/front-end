import { useMutation, useQuery } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type {
    EventListResponse,
    EventData,
    EventDetailResponse,
    RegisterEventResponse,
} from "@/types/events"

// query key
export const EVENTS_QUERY_KEY = "events"

const getListEvent = async (): Promise<EventListResponse> => {
    const response = await api.get<EventListResponse>("/events")
    return response.data
}

export const getDetailEvent = async (
    slug: string,
): Promise<EventDetailResponse> => {
    const response = await api.get<EventDetailResponse>(`/events/${slug}`)
    return response.data
}

const registerEvent = async (eventCode: string): Promise<any> => {
    const response = await api.post<any>("/events/register-event", {
        event_code: eventCode,
    })
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
