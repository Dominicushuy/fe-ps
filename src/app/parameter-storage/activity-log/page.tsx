// /app/activity-log/page.tsx

"use client";

import React, { useState } from "react";
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
    ExclamationCircleIcon,
    AdjustmentsHorizontalIcon,
    XMarkIcon,
} from "@heroicons/react/24/outline";

export default function ActivityLogPage() {
    const {
        filters,
        paginatedData,
        currentPage,
        itemsPerPage,
        totalItems,
        filteredData,
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

    // Đếm số lượng hoạt động theo từng trạng thái
    const successCount = filteredData.filter(
        a => a.status === "Success",
    ).length;
    const processingCount = filteredData.filter(
        a => a.status === "Processing",
    ).length;
    const failedCount = filteredData.filter(a => a.status === "Failed").length;

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
                                    Hide Filters
                                </>
                            ) : (
                                <>
                                    <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    Show Filters
                                </>
                            )}
                        </button>
                    </div>

                    {/* Filter container - responsive */}
                    <div
                        className={`${
                            showFilters ? "block" : "hidden"
                        } md:block bg-gray-50 p-4 rounded-lg mb-6`}
                    >
                        <div className="flex items-center mb-3">
                            <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600 mr-2" />
                            <h3 className="text-base font-medium text-primary-900">
                                フィルター (Filters)
                            </h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* ClientSelect */}
                            <div>
                                <ClientSelect
                                    selectedClient={filters.client}
                                    onClientSelect={handleClientSelect}
                                />
                            </div>

                            {/* DateRangeFilter */}
                            <div>
                                <DateRangeFilter
                                    dateOption={filters.dateOption}
                                    customStartDate={filters.customStartDate}
                                    customEndDate={filters.customEndDate}
                                    onDateOptionChange={handleDateOptionChange}
                                    onCustomDateChange={handleCustomDateChange}
                                />
                            </div>

                            {/* TypeFilter */}
                            <div>
                                <TypeFilter
                                    selectedType={filters.type}
                                    onTypeChange={handleTypeChange}
                                />
                            </div>

                            {/* StatusFilter */}
                            <div>
                                <StatusFilter
                                    selectedStatus={filters.status}
                                    onStatusChange={handleStatusChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Active Filters Summary */}
                    <div className="mb-6">
                        <div className="flex flex-wrap gap-2 items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                                Applied Filters:
                            </span>

                            {filters.client ? (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                    Client: {filters.client.name}
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Client: All
                                </span>
                            )}

                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {filters.dateOption}
                                {filters.dateOption === "Custom" &&
                                    filters.customStartDate &&
                                    ` (${filters.customStartDate.toLocaleDateString()} - ${
                                        filters.customEndDate?.toLocaleDateString() ||
                                        "Now"
                                    })`}
                            </span>

                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    filters.type !== "All"
                                        ? "bg-purple-100 text-purple-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {filters.type === "Download" ? (
                                    <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                                ) : filters.type === "Upload" ? (
                                    <ArrowUpTrayIcon className="h-3 w-3 mr-1" />
                                ) : null}
                                Type: {filters.type}
                            </span>

                            <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                                    filters.status === "Success"
                                        ? "bg-green-100 text-green-800"
                                        : filters.status === "Processing"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : filters.status === "Failed"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-800"
                                }`}
                            >
                                {filters.status === "Success" ? (
                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                ) : filters.status === "Processing" ? (
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                ) : filters.status === "Failed" ? (
                                    <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                ) : null}
                                Status: {filters.status}
                            </span>
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center">
                            <div className="rounded-full bg-primary-100 p-1.5 mr-2">
                                <ClipboardDocumentListIcon className="h-4 w-4 text-primary-700" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Total</p>
                                <p className="text-lg font-semibold text-gray-800">
                                    {totalItems}
                                </p>
                            </div>
                        </div>

                        <div className="bg-green-50 p-3 rounded-lg border border-green-100 flex items-center">
                            <div className="rounded-full bg-green-100 p-1.5 mr-2">
                                <CheckCircleIcon className="h-4 w-4 text-green-700" />
                            </div>
                            <div>
                                <p className="text-xs text-green-500">
                                    Success
                                </p>
                                <p className="text-lg font-semibold text-green-700">
                                    {successCount}
                                </p>
                            </div>
                        </div>

                        <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex items-center">
                            <div className="rounded-full bg-yellow-100 p-1.5 mr-2">
                                <ClockIcon className="h-4 w-4 text-yellow-700" />
                            </div>
                            <div>
                                <p className="text-xs text-yellow-500">
                                    Processing
                                </p>
                                <p className="text-lg font-semibold text-yellow-700">
                                    {processingCount}
                                </p>
                            </div>
                        </div>

                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 flex items-center">
                            <div className="rounded-full bg-red-100 p-1.5 mr-2">
                                <ExclamationCircleIcon className="h-4 w-4 text-red-700" />
                            </div>
                            <div>
                                <p className="text-xs text-red-500">Failed</p>
                                <p className="text-lg font-semibold text-red-700">
                                    {failedCount}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Table */}
                    <div className="mb-4">
                        <ActivityTable activities={paginatedData} />
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
