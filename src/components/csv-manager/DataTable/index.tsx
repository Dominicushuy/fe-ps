"use client";

import React, { useMemo, useState } from "react";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import { CSVRow, ColumnFilter } from "@/types";
import { applyFilters } from "@/lib/utils/filter-utils";

interface DataTableProps {
    data: CSVRow[];
    currentPage: number;
    itemsPerPage: number;
    filters: ColumnFilter[];
    searchTerm: string;
    isDownloadMode?: boolean;
}

export default function DataTable({
    data,
    currentPage,
    itemsPerPage,
    filters,
    searchTerm,
    isDownloadMode = false,
}: DataTableProps) {
    const [sortConfig, setSortConfig] = useState<{
        key: string | null;
        direction: "ascending" | "descending";
    }>({
        key: null,
        direction: "ascending",
    });

    // Áp dụng bộ lọc và tìm kiếm vào dữ liệu
    const filteredData = useMemo(() => {
        return applyFilters(data, filters, searchTerm);
    }, [data, filters, searchTerm]);

    // Sắp xếp dữ liệu
    const sortedData = useMemo(() => {
        const sortableData = [...filteredData];
        if (sortConfig.key) {
            sortableData.sort((a, b) => {
                if (a[sortConfig.key!] < b[sortConfig.key!]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key!] > b[sortConfig.key!]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableData;
    }, [filteredData, sortConfig]);

    // Phân trang dữ liệu
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedData.slice(startIndex, startIndex + itemsPerPage);
    }, [sortedData, currentPage, itemsPerPage]);

    // Xử lý sắp xếp khi nhấp vào header
    const requestSort = (key: string) => {
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Nếu không có dữ liệu, hiển thị thông báo
    if (data.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg">
                <p className="text-gray-500">
                    データがありません (No data available)
                </p>
            </div>
        );
    }

    // Lấy danh sách các cột từ dữ liệu
    const columns = Object.keys(data[0]).filter(column =>
        isDownloadMode ? column !== "Action" : true,
    );

    // Nếu không có dữ liệu sau khi lọc, hiển thị thông báo
    if (filteredData.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg">
                <p className="text-gray-500">
                    検索条件に一致するデータがありません (No data matching the
                    filter criteria)
                </p>
                {(filters.length > 0 || searchTerm) && (
                    <p className="text-sm text-gray-400 mt-2">
                        検索条件またはフィルターを変更してみてください (Try
                        changing your search term or filters)
                    </p>
                )}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-md ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-primary-50">
                            <tr>
                                {columns.map(column => (
                                    <th
                                        key={column}
                                        scope="col"
                                        className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                        onClick={() => requestSort(column)}
                                    >
                                        <div className="group flex items-center">
                                            <span className="whitespace-nowrap">
                                                {column}
                                            </span>
                                            <span className="ml-2 flex-none rounded text-primary-500 group-hover:visible">
                                                {sortConfig.key === column ? (
                                                    sortConfig.direction ===
                                                    "ascending" ? (
                                                        <ChevronUpIcon className="h-4 w-4" />
                                                    ) : (
                                                        <ChevronDownIcon className="h-4 w-4" />
                                                    )
                                                ) : (
                                                    <div className="h-4 w-4" />
                                                )}
                                            </span>
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {paginatedData.map((row, rowIndex) => (
                                <tr
                                    key={rowIndex}
                                    className={
                                        rowIndex % 2 === 0
                                            ? "bg-white hover:bg-gray-50"
                                            : "bg-gray-50 hover:bg-gray-100"
                                    }
                                >
                                    {columns.map(column => (
                                        <td
                                            key={`${rowIndex}-${column}`}
                                            className="whitespace-nowrap px-3 py-4 text-sm text-gray-500"
                                        >
                                            {row[column] || (
                                                <span className="text-gray-300 italic">
                                                    Empty
                                                </span>
                                            )}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Hiển thị thông tin số lượng bản ghi */}
            <div className="mt-2 text-sm text-gray-600">
                合計{" "}
                <span className="font-medium text-primary-800">
                    {filteredData.length}
                </span>{" "}
                レコード中
                <span className="font-medium text-primary-800">
                    {" "}
                    {Math.min(
                        (currentPage - 1) * itemsPerPage + 1,
                        filteredData.length,
                    )}
                </span>{" "}
                から
                <span className="font-medium text-primary-800">
                    {" "}
                    {Math.min(currentPage * itemsPerPage, filteredData.length)}
                </span>{" "}
                まで表示
                {filteredData.length !== data.length && (
                    <span className="text-gray-500">
                        {" "}
                        (フィルター適用済み: 元の {data.length} レコードから)
                    </span>
                )}
            </div>
        </div>
    );
}
