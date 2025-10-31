import { ListData } from "./common"

export interface EventData {
    id_event: string
    title: string
    slug: string
    start_event: string
    end_event: string
    event_code: string
    is_public: boolean
}

export interface EventListResponse extends ListData<EventData> {
    data: EventData[]
}
