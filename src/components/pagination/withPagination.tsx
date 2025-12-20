import React, { useState } from "react"
import PaginationControls from "@/components/pagination/PaginationControls"

interface PaginationData {
    currentPage: number
    totalItems: number
    totalPages: number
}

interface WithPaginationProps {
    page: number
    setPage: (page: number) => void
    paginationData?: PaginationData
}

interface WithPaginationOptions {
    showPaginationOnTop?: boolean
    showPaginationOnBottom?: boolean
}

/**
 * HOC that adds pagination functionality to a component
 * @param WrappedComponent - The component to wrap with pagination
 * @param options - Configuration options for pagination display
 */
export function withPagination<P extends object>(
    WrappedComponent: React.ComponentType<P & WithPaginationProps>,
    options: WithPaginationOptions = {
        showPaginationOnTop: false,
        showPaginationOnBottom: true,
    },
) {
    return function WithPaginationComponent(
        props: Omit<P, keyof WithPaginationProps>,
    ) {
        const [page, setPage] = useState(1)

        // Get pagination data from wrapped component props if available
        const paginationData = (props as any).paginationData as
            | PaginationData
            | undefined

        const handlePageChange = (newPage: number) => {
            setPage(newPage)
            // Scroll to top when page changes
            window.scrollTo({ top: 0, behavior: "smooth" })
        }

        const renderPagination = () => {
            if (!paginationData) return null

            return (
                <PaginationControls
                    currentPage={paginationData.currentPage}
                    totalPages={paginationData.totalPages}
                    onPageChange={handlePageChange}
                />
            )
        }

        return (
            <div className="w-full">
                {options.showPaginationOnTop && renderPagination()}

                <WrappedComponent
                    {...(props as P)}
                    page={page}
                    setPage={setPage}
                    paginationData={paginationData}
                />

                {options.showPaginationOnBottom && renderPagination()}
            </div>
        )
    }
}
