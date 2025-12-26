"use client"

import React, { ReactNode, useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import PaginationControls from "@/components/pagination/PaginationControls"
import { Search, X } from "lucide-react"
import { useDebounce } from "use-debounce"

export interface SortOption {
    label: string
    value: {
        sortBy: string
        order: "asc" | "desc"
    }
}

interface GenericListViewProps {
    // Search
    searchValue: string
    onSearchChange: (value: string) => void
    searchPlaceholder?: string
    showSearch?: boolean

    // Sort
    sortOptions: SortOption[]
    currentSortBy: string
    currentOrder: "asc" | "desc"
    onSortChange: (sortBy: string, order: "asc" | "desc") => void
    showSort?: boolean

    // Pagination
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
    showPagination?: boolean

    // Content
    children: ReactNode
    isLoading?: boolean
    isInitialLoading?: boolean
    isEmpty?: boolean
    emptyState?: ReactNode

    // Additional filters (e.g., tabs)
    additionalFilters?: ReactNode
}

export default function GenericListView({
    searchValue,
    onSearchChange,
    searchPlaceholder = "Search...",
    showSearch = true,
    sortOptions,
    currentSortBy,
    currentOrder,
    onSortChange,
    showSort = true,
    currentPage,
    totalPages,
    onPageChange,
    showPagination = true,
    children,
    isLoading = false,
    isInitialLoading = false,
    isEmpty = false,
    emptyState,
    additionalFilters,
}: GenericListViewProps) {
    // Local state for immediate input update
    const [localSearchValue, setLocalSearchValue] = useState(searchValue)

    // Debounce the search value before calling parent onChange
    const [debouncedSearchValue] = useDebounce(localSearchValue, 500)

    // Sync local state with prop when searchValue changes externally
    useEffect(() => {
        setLocalSearchValue(searchValue)
    }, [searchValue])

    // Call parent onChange when debounced value changes
    useEffect(() => {
        if (debouncedSearchValue !== searchValue) {
            onSearchChange(debouncedSearchValue)
        }
    }, [debouncedSearchValue, onSearchChange, searchValue])

    // Find current sort value for select - using label as the value identifier
    const currentSortValue =
        sortOptions.find(
            (opt) =>
                opt.value.sortBy === currentSortBy &&
                opt.value.order === currentOrder,
        )?.label || sortOptions[0]?.label // fallback to first option

    const handleSortChange = (label: string) => {
        const selectedOption = sortOptions.find((opt) => opt.label === label)
        if (selectedOption) {
            onSortChange(
                selectedOption.value.sortBy,
                selectedOption.value.order,
            )
        }
    }

    return (
        <div className="space-y-6">
            {/* Search and Sort Controls */}
            {(showSearch || showSort) && (
                <div className="flex flex-col flex-wrap sm:flex-row gap-4 items-center justify-between">
                    {/* Search Input */}
                    {showSearch &&
                        (isInitialLoading ? (
                            <div className="relative w-full sm:w-80 animate-pulse">
                                <div className="h-10 bg-slate-200 rounded-full w-full" />
                            </div>
                        ) : (
                            <div className="relative w-full sm:w-80">
                                <Input
                                    type="text"
                                    placeholder={searchPlaceholder}
                                    value={localSearchValue}
                                    onChange={(e) =>
                                        setLocalSearchValue(e.target.value)
                                    }
                                    className="pl-10 bg-white"
                                    startContent={
                                        <Search className="h-4 w-4" />
                                    }
                                    endContent={
                                        debouncedSearchValue ? (
                                            <button
                                                onClick={() =>
                                                    setLocalSearchValue("")
                                                }
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        ) : null
                                    }
                                />
                            </div>
                        ))}

                    {/* Additional Filters (like Tabs) */}
                    {additionalFilters && (
                        <div className="flex justify-center gap-6 max-md:flex-wrap max-md:order-2 w-full flex-1">
                            {isInitialLoading ? (
                                <div className="h-10 w-60 rounded-md bg-slate-200 mb-2 mx-auto"></div>
                            ) : (
                                additionalFilters
                            )}
                        </div>
                    )}
                    {/* Sort Dropdown */}
                    {showSort && (
                        <div className="w-full sm:w-auto sm:min-w-[200px]">
                            {isInitialLoading ? (
                                <div className="h-10 bg-slate-200 rounded-md w-full" />
                            ) : (
                                <Select
                                    value={currentSortValue}
                                    onValueChange={handleSortChange}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue placeholder="Sort by" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {sortOptions.map((option) => (
                                            <SelectItem
                                                key={option.label}
                                                value={option.label}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Content */}
            {
                isLoading
                    ? children // Show loading skeleton passed as children
                    : isEmpty
                      ? emptyState // Show empty state
                      : children // Show actual content
            }

            {/* Pagination */}
            {showPagination && !isLoading && !isEmpty && (
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    )
}
