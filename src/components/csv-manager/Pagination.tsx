"use client";

import React, { useMemo } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";

interface PaginationProps {
    currentPage: number;
    itemsPerPage: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    maxPageButtons?: number;
}

export default function Pagination({
    currentPage,
    itemsPerPage,
    totalItems,
    onPageChange,
    onItemsPerPageChange,
    maxPageButtons = 5,
}: PaginationProps) {
    // Tính toán tổng số trang
    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(totalItems / itemsPerPage));
    }, [totalItems, itemsPerPage]);

    // Tính toán các trang sẽ hiển thị trong phân trang
    const pageNumbers = useMemo(() => {
        // Nếu tổng số trang ít hơn hoặc bằng maxPageButtons, hiển thị tất cả
        if (totalPages <= maxPageButtons) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        // Nếu nhiều hơn, cần tính toán để hiển thị trang hiện tại ở giữa khi có thể
        const halfButtons = Math.floor(maxPageButtons / 2);

        // Nếu currentPage gần đầu
        if (currentPage <= halfButtons + 1) {
            return Array.from({ length: maxPageButtons }, (_, i) => i + 1);
        }

        // Nếu currentPage gần cuối
        if (currentPage >= totalPages - halfButtons) {
            return Array.from(
                { length: maxPageButtons },
                (_, i) => totalPages - maxPageButtons + i + 1,
            );
        }

        // Ở giữa
        return Array.from(
            { length: maxPageButtons },
            (_, i) => currentPage - halfButtons + i,
        );
    }, [currentPage, totalPages, maxPageButtons]);

    // Tính toán các chỉ số của mục đang hiển thị
    const { startIndex, endIndex } = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage + 1;
        const end = Math.min(start + itemsPerPage - 1, totalItems);
        return { startIndex: start, endIndex: end };
    }, [currentPage, itemsPerPage, totalItems]);

    // Các lựa chọn cho số lượng mục mỗi trang
    const itemsPerPageOptions = [10, 20, 50, 100];

    return (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Thông tin về mục đang hiển thị */}
            <div className="text-sm text-gray-700">
                <span>表示: </span>
                <span className="font-medium text-primary-800">
                    {startIndex}
                </span>
                <span> - </span>
                <span className="font-medium text-primary-800">{endIndex}</span>
                <span> / </span>
                <span className="font-medium text-primary-800">
                    {totalItems}
                </span>
                <span> 件</span>
            </div>

            {/* Điều khiển phân trang */}
            <div className="flex items-center">
                {/* Chọn số lượng mục mỗi trang */}
                <div className="mr-4">
                    <label htmlFor="items-per-page" className="sr-only">
                        アイテム/ページ
                    </label>
                    <select
                        id="items-per-page"
                        className="rounded-md border-gray-300 py-1 pl-2 pr-8 text-sm focus:border-primary-600 focus:ring-primary-600 transition-colors"
                        value={itemsPerPage}
                        onChange={e =>
                            onItemsPerPageChange(Number(e.target.value))
                        }
                    >
                        {itemsPerPageOptions.map(option => (
                            <option key={option} value={option}>
                                {option} 件/ページ
                            </option>
                        ))}
                    </select>
                </div>

                {/* Các nút phân trang */}
                <nav
                    className="flex items-center space-x-1"
                    aria-label="Pagination"
                >
                    {/* First page */}
                    <button
                        onClick={() => onPageChange(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-md p-1.5 transition-colors
              ${
                  currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-primary-600 hover:bg-primary-100 hover:text-primary-800"
              }`}
                        aria-label="First page"
                    >
                        <ChevronDoubleLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Previous page */}
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center rounded-md p-1.5 transition-colors
              ${
                  currentPage === 1
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-primary-600 hover:bg-primary-100 hover:text-primary-800"
              }`}
                        aria-label="Previous page"
                    >
                        <ChevronLeftIcon className="h-4 w-4" />
                    </button>

                    {/* Page numbers */}
                    <div className="hidden sm:flex sm:items-center sm:space-x-1">
                        {pageNumbers.map(page => (
                            <button
                                key={page}
                                onClick={() => onPageChange(page)}
                                className={`relative inline-flex items-center rounded-md px-3 py-1.5 text-sm transition-colors
                  ${
                      page === currentPage
                          ? "bg-primary-800 text-white font-medium"
                          : "text-gray-700 hover:bg-primary-100 hover:text-primary-800"
                  }`}
                                aria-current={
                                    page === currentPage ? "page" : undefined
                                }
                            >
                                {page}
                            </button>
                        ))}
                    </div>

                    {/* Current page indicator for mobile */}
                    <span className="sm:hidden text-sm text-gray-700">
                        {currentPage} / {totalPages}
                    </span>

                    {/* Next page */}
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-md p-1.5 transition-colors
              ${
                  currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-primary-600 hover:bg-primary-100 hover:text-primary-800"
              }`}
                        aria-label="Next page"
                    >
                        <ChevronRightIcon className="h-4 w-4" />
                    </button>

                    {/* Last page */}
                    <button
                        onClick={() => onPageChange(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center rounded-md p-1.5 transition-colors
              ${
                  currentPage === totalPages
                      ? "text-gray-300 cursor-not-allowed"
                      : "text-primary-600 hover:bg-primary-100 hover:text-primary-800"
              }`}
                        aria-label="Last page"
                    >
                        <ChevronDoubleRightIcon className="h-4 w-4" />
                    </button>
                </nav>
            </div>
        </div>
    );
}
