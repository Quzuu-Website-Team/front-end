export interface ListData<T = unknown> {
    status: string
    data: T[]
    message: string
    meta_data: {
        current_page: number
        page_size: number
        total_records: number
    }
}
