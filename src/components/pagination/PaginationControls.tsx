import React from "react"
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    maxVisiblePages?: number
}

export default function PaginationControls({
    currentPage,
    totalPages,
    onPageChange,
    maxVisiblePages = 5,
}: PaginationControlsProps) {
    // Don't show pagination if only 1 page or no pages
    if (totalPages <= 1) return null

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = []
        const halfVisible = Math.floor(maxVisiblePages / 2)

        if (totalPages <= maxVisiblePages) {
            // Show all pages if total is less than max visible
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            let start = Math.max(2, currentPage - halfVisible)
            let end = Math.min(totalPages - 1, currentPage + halfVisible)

            // Adjust start and end to always show maxVisiblePages
            if (currentPage <= halfVisible) {
                end = maxVisiblePages - 1
            } else if (currentPage >= totalPages - halfVisible) {
                start = totalPages - maxVisiblePages + 2
            }

            // Add ellipsis after first page if needed
            if (start > 2) {
                pages.push("ellipsis")
            }

            // Add middle pages
            for (let i = start; i <= end; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (end < totalPages - 1) {
                pages.push("ellipsis")
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    const handlePrevious = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }
    }

    const handleNext = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    }

    const pageNumbers = getPageNumbers()

    return (
        <Pagination className="my-8 rounded-full px-6 py-2 bg-white w-fit">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={handlePrevious}
                        className={
                            currentPage === 1
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>

                {pageNumbers.map((page, index) => (
                    <PaginationItem
                        key={`${page}-${index}`}
                        className={currentPage !== page ? "max-sm:hidden" : ""}
                    >
                        {page === "ellipsis" ? (
                            <PaginationEllipsis />
                        ) : (
                            <PaginationLink
                                onClick={() => onPageChange(page)}
                                isActive={currentPage === page}
                                className="cursor-pointer"
                            >
                                {page}
                            </PaginationLink>
                        )}
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationNext
                        onClick={handleNext}
                        className={
                            currentPage === totalPages
                                ? "pointer-events-none opacity-50"
                                : "cursor-pointer"
                        }
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
