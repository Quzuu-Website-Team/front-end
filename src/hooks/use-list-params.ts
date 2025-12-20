import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { useCallback } from "react"

interface UseListParamsOptions {
    defaultSortBy?: string
    defaultOrder?: "asc" | "desc"
}

export const useListParams = (options?: UseListParamsOptions) => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const { defaultSortBy = "created_at", defaultOrder = "desc" } =
        options || {}

    // get state from URL
    const page = Number(searchParams.get("page")) || 1
    const search = searchParams.get("search") || ""
    const sort = searchParams.get("sortBy") || defaultSortBy
    const order = searchParams.get("order") || defaultOrder
    const registerStatus = searchParams.get("registerStatus") || ""

    // Helper for update URL without refresh
    const setParam = useCallback(
        (key: string, value: string | number) => {
            const params = new URLSearchParams(searchParams)
            if (value) {
                params.set(key, String(value))
            } else {
                params.delete(key)
            }
            // Reset page to 1 if filter changes (except for the page itself)
            if (key !== "page") params.set("page", "1")

            router.replace(`${pathname}?${params.toString()}`)
        },
        [searchParams, pathname, router],
    )

    // Helper for updating sort (sortBy + order together to avoid race condition)
    const setSortAndOrder = useCallback(
        (sortBy: string, order: string) => {
            const params = new URLSearchParams(searchParams)
            params.set("sortBy", sortBy)
            params.set("order", order)
            params.set("page", "1") // Reset page when sorting changes

            router.replace(`${pathname}?${params.toString()}`)
        },
        [searchParams, pathname, router],
    )

    return {
        page,
        search,
        sort,
        order,
        registerStatus,
        setSortAndOrder,
        setPage: (val: number) => setParam("page", val),
        setSearch: (val: string) => setParam("search", val),
        setRegisterStatus: (val: string) => setParam("registerStatus", val),
    }
}
