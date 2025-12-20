export interface PaginationMetadata {
    currentPage: number
    totalItems: number
    totalPages: number
}

export interface ListData<T = unknown> extends PaginationMetadata {
    data: T[]
}

// response format with pagination
export interface ListDataResponse<T = unknown> extends ListData<T> {
    status: string
    message: string
    meta_data: PaginationMetadata
}

export interface ResponseData<T = unknown, M = unknown> {
    status: string
    data: T
    message: string
    meta_data: M
}
