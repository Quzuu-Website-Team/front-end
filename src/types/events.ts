import { ListData } from "./common"

export interface EventData {
    id_event: string
    title: string
    slug: string
    start_event: string
    end_event: string
    event_code?: string
    img_banner?: string
    is_public: boolean
    overview: string
    register_status?: boolean
}

export interface EventListResponse extends ListData<EventData> {
    data: EventData[]
}

export interface EventDetailResponse {
    data: {
        Data: EventData
        register_status: number
    }
}

export interface RegisterEventResponse extends EventDetailResponse {
    message: string
    success: boolean
}
