// src/app/parameter-storage/activity-log/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import ClientSelect from "@/components/csv-manager/ClientSelect";
import DateRangeFilter from "@/components/activity-manager/DateRangeFilter";
import TypeFilter from "@/components/activity-manager/TypeFilter";
import StatusFilter from "@/components/activity-manager/StatusFilter";
import ActivityTable from "@/components/activity-manager/ActivityTable";
import Pagination from "@/components/csv-manager/Pagination";
import { useActivityManager } from "@/hooks/useActivityManager";
import {
    ClipboardDocumentListIcon,
    FunnelIcon,
    CalendarIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    CheckCircleIcon,
    ClockIcon,
    XCircleIcon,
    ExclamationCircleIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";
import { mockClients } from "@/data/mock-clients";
import { Activity } from "@/types";

export default function ActivityLogPage() {
    const searchParams = useSearchParams();
    const clientIdParam = searchParams.get("clientId");

    const {
        filters,
        paginatedData,
        currentPage,
        itemsPerPage,
        totalItems,
        handleClientSelect,
        handleDateOptionChange,
        handleCustomDateChange,
        handleTypeChange,
        handleStatusChange,
        handlePageChange,
        handleItemsPerPageChange,
    } = useActivityManager();

    // State để toggle hiển thị/ẩn bộ lọc trên mobile
    const [showFilters, setShowFilters] = useState(false);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    // Xử lý clientId từ URL parameters
    useEffect(() => {
        if (clientIdParam && isInitialLoad) {
            // Tìm client trong danh sách clients dựa trên id
            const client = mockClients.find(c => c.id === clientIdParam);

            if (client) {
                // Cập nhật filter theo client
                handleClientSelect(client);
            }

            setIsInitialLoad(false);
        }
    }, [clientIdParam, handleClientSelect, isInitialLoad]);

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-primary-700 text-white p-4">
                    <h2 className="text-xl font-semibold flex items-center">
                        <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />
                        アクティビティログ (Activity Log)
                    </h2>
                    <p className="text-primary-100 text-sm mt-1">
                        すべてのアップロードおよびダウンロード操作の履歴
                        (History of all upload and download operations)
                    </p>
                </div>

                <div className="p-4">
                    {/* Filter toggle button - hiển thị chỉ trên mobile */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {showFilters ? (
                                <>
                                    <XMarkIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    フィルターを閉じる (Hide Filters)
                                </>
                            ) : (
                                <>
                                    <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    フィルターを表示 (Show Filters)
                                </>
                            )}
                        </button>
                    </div>

                    {/* Filter container - redesigned with tabs and better organization */}
                    <div
                        className={`${
                            showFilters ? "block" : "hidden"
                        } md:block bg-gray-50 p-4 rounded-lg mb-6`}
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center">
                                <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600 mr-2" />
                                <h3 className="text-base font-medium text-primary-900">
                                    フィルター (Filters)
                                </h3>
                            </div>

                            {/* Clear all filters button */}
                            <button
                                className="text-xs text-gray-500 hover:text-red-500 flex items-center"
                                onClick={() => {
                                    handleClientSelect(null);
                                    handleDateOptionChange("Last7Days");
                                    handleTypeChange("All");
                                    handleStatusChange("All");
                                }}
                            >
                                <XMarkIcon className="h-3 w-3 mr-1" />
                                すべてクリア (Clear All)
                            </button>
                        </div>

                        {/* Two-column layout for filters on larger screens */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Left column - Client and Date Range */}
                            <div className="space-y-4">
                                {/* ClientSelect */}
                                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                    <ClientSelect
                                        selectedClient={filters.client}
                                        onClientSelect={handleClientSelect}
                                    />
                                </div>

                                {/* DateRangeFilter */}
                                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                    <DateRangeFilter
                                        dateOption={filters.dateOption}
                                        customStartDate={
                                            filters.customStartDate
                                        }
                                        customEndDate={filters.customEndDate}
                                        onDateOptionChange={
                                            handleDateOptionChange
                                        }
                                        onCustomDateChange={
                                            handleCustomDateChange
                                        }
                                    />
                                </div>
                            </div>

                            {/* Right column - Type and Status */}
                            <div className="space-y-4">
                                {/* TypeFilter */}
                                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                    <TypeFilter
                                        selectedType={filters.type}
                                        onTypeChange={handleTypeChange}
                                    />
                                </div>

                                {/* StatusFilter - Redesigned to use a more compact layout */}
                                <div className="bg-white p-3 rounded-md border border-gray-200 shadow-sm">
                                    <StatusFilter
                                        selectedStatus={filters.status}
                                        onStatusChange={handleStatusChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Summary - Horizontal chips */}
                    <div className="mb-6 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                            適用フィルター (Applied Filters)
                        </h4>

                        <div className="flex flex-wrap gap-2 items-center">
                            {/* Client filter chip */}
                            <div
                                className={`px-3 py-1.5 rounded-full text-xs font-medium 
                                ${
                                    filters.client
                                        ? "bg-primary-100 text-primary-800"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                <span className="mr-1">👤</span>
                                Client:{" "}
                                {filters.client ? filters.client.name : "All"}
                            </div>

                            {/* Date filter chip */}
                            <div className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full text-xs font-medium">
                                <CalendarIcon className="h-3 w-3 mr-1 inline" />
                                {filters.dateOption === "Custom" &&
                                filters.customStartDate
                                    ? `${filters.customStartDate.toLocaleDateString()} - ${
                                          filters.customEndDate?.toLocaleDateString() ||
                                          "Now"
                                      }`
                                    : filters.dateOption}
                            </div>

                            {/* Type filter chip */}
                            <div
                                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center
                                ${
                                    filters.type !== "All"
                                        ? filters.type === "Download"
                                            ? "bg-purple-100 text-purple-800"
                                            : "bg-indigo-100 text-indigo-800"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {filters.type === "Download" ? (
                                    <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                                ) : filters.type === "Upload" ? (
                                    <ArrowUpTrayIcon className="h-3 w-3 mr-1" />
                                ) : null}
                                Type: {filters.type}
                            </div>

                            {/* Status filter chip */}
                            <div
                                className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center
                                ${
                                    filters.status === "done"
                                        ? "bg-green-100 text-green-800"
                                        : filters.status === "processing"
                                        ? "bg-blue-100 text-blue-800"
                                        : filters.status === "waiting"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : filters.status === "invalid"
                                        ? "bg-orange-100 text-orange-800"
                                        : filters.status === "error"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-700"
                                }`}
                            >
                                {filters.status === "done" ? (
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                ) : filters.status === "processing" ? (
                                    <ClockIcon className="h-3 w-3 mr-1 animate-spin" />
                                ) : filters.status === "waiting" ? (
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                ) : filters.status === "invalid" ? (
                                    <XCircleIcon className="h-3 w-3 mr-1" />
                                ) : filters.status === "error" ? (
                                    <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                ) : null}
                                Status: {filters.status}
                            </div>
                        </div>
                    </div>

                    {/* Activity Table and remaining content */}
                    <div className="mb-4">
                        <ActivityTable
                            activities={paginatedData as Activity[]}
                        />
                    </div>

                    {/* Pagination */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            totalItems={totalItems}
                            onPageChange={handlePageChange}
                            onItemsPerPageChange={handleItemsPerPageChange}
                            maxPageButtons={5}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
