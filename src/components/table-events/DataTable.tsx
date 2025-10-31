"use client"

import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    loading?: boolean
    error?: string | null
}

export function DataTable<TData, TValue>({
    columns,
    data,
    loading = true,
    error,
}: DataTableProps<TData, TValue>) {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            columnFilters,
        },
    })

    const router = useRouter()

    if (loading) {
        return (
            <Card className="col-span-2">
                <CardHeader>
                    <div className="header-group flex items-center justify-between">
                        <CardTitle className="h-8 w-32 animate-pulse rounded-md bg-slate-300"></CardTitle>
                        <div className="flex items-center justify-end basis-2/3">
                            <CardTitle className="h-10 w-56 animate-pulse rounded-full bg-slate-300"></CardTitle>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-slate-800">
                        <div className="rounded-2xl border bg-white shadow">
                            <Table>
                                <TableHeader>
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                key={header.id}
                                                            >
                                                                <div className="h-6 w-24 animate-pulse rounded-md bg-slate-300"></div>
                                                            </TableHead>
                                                        )
                                                    },
                                                )}
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {Array(5)
                                        .fill({})
                                        .map((row, index) => (
                                            <TableRow
                                                key={index}
                                                className="hover:bg-violet-100 cursor-pointer"
                                            >
                                                {columns.map(
                                                    (column, colIndex) => (
                                                        <TableCell
                                                            key={colIndex}
                                                        >
                                                            <div className="h-4 w-20 animate-pulse rounded-md bg-slate-300"></div>
                                                        </TableCell>
                                                    ),
                                                )}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex items-center justify-end gap-4">
                    <div className="h-8 w-20 animate-pulse rounded-full bg-slate-300"></div>
                    <div className="h-8 w-20 animate-pulse rounded-full bg-slate-300"></div>
                </CardFooter>
            </Card>
        )
    }

    return (
        <Card className="col-span-2">
            <CardHeader>
                <div className="header-group flex items-center justify-between">
                    <CardTitle className="basis-1/3">Events</CardTitle>
                    <div className="flex items-center justify-end basis-2/3">
                        <Input
                            placeholder="Search events..."
                            value={
                                (table
                                    .getColumn("title")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("title")
                                    ?.setFilterValue(event.target.value)
                            }
                            className="max-w-sm ring-primary"
                        />
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-slate-800">
                    <Table>
                        <TableHeader>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                        return (
                                            <TableHead key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        )
                                    })}
                                </TableRow>
                            ))}
                        </TableHeader>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        navigable
                                        data-state={
                                            row.getIsSelected() && "selected"
                                        }
                                        href="/event-details/1"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No results.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
            <CardFooter className="flex items-center justify-end gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    iconLeft={<ChevronLeft size={16} />}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    iconRight={<ChevronRight size={16} />}
                >
                    Next
                </Button>
            </CardFooter>
        </Card>
    )
}
