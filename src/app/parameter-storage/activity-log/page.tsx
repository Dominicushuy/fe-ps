// src/app/parameter-storage/activity-log/page.tsx
"use client";

import React, { useState } from "react";
import ClientSelect from "@/components/csv-manager/ClientSelect";
import EmployeeSelect from "@/components/activity-manager/EmployeeSelect";
import DateRangeFilter from "@/components/activity-manager/DateRangeFilter";
import ActivityTable from "@/components/activity-manager/ActivityTable";
import Pagination from "@/components/csv-manager/Pagination";
import SearchBar from "@/components/csv-manager/SearchBar";
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
    ArrowPathIcon,
    MagnifyingGlassIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { Activity } from "@/types";
import { useTranslations } from "next-intl";

// Main component with React Query implementation
export default function ActivityLogPage() {
    const t = useTranslations();
    const {
        filters,
        paginatedData,
        isLoading,
        error,
        currentPage,
        itemsPerPage,
        totalItems,
        handleClientSelect,
        handleEmployeeSelect,
        handleDateOptionChange,
        handleCustomDateChange,
        handleTypeChange,
        handleStatusChange,
        handleSearchChange,
        handlePageChange,
        handleItemsPerPageChange,
        fetchActivities,
    } = useActivityManager();

    // State for mobile filters toggle
    const [showFilters, setShowFilters] = useState(false);

    // Handler to refresh data
    const handleRefresh = () => {
        fetchActivities();
    };

    return (
        <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                {/* Header */}
                <div className="bg-primary-700 text-white p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold flex items-center">
                            <ClipboardDocumentListIcon className="h-6 w-6 mr-2" />
                            {t("activityLog")}
                        </h2>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleRefresh}
                                className="p-2 bg-primary-600 rounded-full hover:bg-primary-500 transition-colors"
                                title={t("refreshData")}
                            >
                                <ArrowPathIcon
                                    className={`h-5 w-5 text-white ${
                                        isLoading ? "animate-spin" : ""
                                    }`}
                                />
                            </button>
                        </div>
                    </div>
                    <p className="text-primary-100 text-sm">
                        {t("activityLogDescription")}
                    </p>
                </div>

                <div className="p-4">
                    {/* Filter toggle button - only on mobile */}
                    <div className="md:hidden mb-4">
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                        >
                            {showFilters ? (
                                <>
                                    <XMarkIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    {t("hideFilters")}
                                </>
                            ) : (
                                <>
                                    <FunnelIcon className="h-5 w-5 mr-2 text-gray-500" />
                                    {t("showFilters")}
                                </>
                            )}
                        </button>
                    </div>

                    {/* Filter container with improved layout */}
                    <div
                        className={`${
                            showFilters ? "block" : "hidden"
                        } md:block mb-6`}
                    >
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                            {/* Header with search */}
                            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                                <div className="flex items-center">
                                    <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-600 mr-2" />
                                    <h3 className="text-base font-medium text-primary-900">
                                        {t("filters")}
                                    </h3>
                                </div>

                                {/* Search bar - taking reasonable width */}
                                <div className="flex-grow max-w-lg">
                                    <SearchBar
                                        searchTerm={filters.searchTerm}
                                        onSearch={handleSearchChange}
                                        placeholder={t("searchPlaceholder")}
                                        debounceMs={500}
                                    />
                                </div>

                                {/* Clear button */}
                                <button
                                    className="text-xs text-gray-500 hover:text-red-500 flex items-center whitespace-nowrap"
                                    onClick={() => {
                                        handleClientSelect(null);
                                        handleEmployeeSelect(null);
                                        handleDateOptionChange("Last7Days");
                                        handleTypeChange("All");
                                        handleStatusChange("All");
                                        handleSearchChange("");
                                    }}
                                >
                                    <XMarkIcon className="h-3 w-3 mr-1" />
                                    {t("clearAll")}
                                </button>
                            </div>

                            {/* Main filter grid - 3 columns on large screens */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Column 1: Client, Employee selectors */}
                                <div className="space-y-4">
                                    {/* Client selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("selectClient")}
                                        </label>
                                        <ClientSelect
                                            selectedClient={filters.client}
                                            onClientSelect={handleClientSelect}
                                        />
                                    </div>

                                    {/* Employee selector */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("selectEmployee")}
                                        </label>
                                        <EmployeeSelect
                                            selectedEmployee={filters.employee}
                                            onEmployeeSelect={
                                                handleEmployeeSelect
                                            }
                                        />
                                    </div>
                                </div>

                                {/* Column 2: Type and Status filters */}
                                <div className="space-y-4">
                                    {/* Type filter */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("typeFilter")}
                                        </label>
                                        <div className="flex rounded-md shadow-sm">
                                            <button
                                                type="button"
                                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-l-md border 
                                                    ${
                                                        filters.type === "All"
                                                            ? "bg-primary-600 text-white border-primary-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleTypeChange("All")
                                                }
                                            >
                                                {t("all")}
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex-1 px-3 py-2 text-sm font-medium border-t border-b 
                                                    ${
                                                        filters.type ===
                                                        "Download"
                                                            ? "bg-primary-600 text-white border-primary-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleTypeChange("Download")
                                                }
                                            >
                                                <div className="flex items-center justify-center">
                                                    <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                                                    <span>{t("download")}</span>
                                                </div>
                                            </button>
                                            <button
                                                type="button"
                                                className={`flex-1 px-3 py-2 text-sm font-medium rounded-r-md border 
                                                    ${
                                                        filters.type ===
                                                        "Upload"
                                                            ? "bg-primary-600 text-white border-primary-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleTypeChange("Upload")
                                                }
                                            >
                                                <div className="flex items-center justify-center">
                                                    <ArrowUpTrayIcon className="h-4 w-4 mr-1" />
                                                    <span>{t("upload")}</span>
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Status filter - using grid for better alignment */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("statusFilter")}
                                        </label>
                                        <div className="grid grid-cols-3 gap-1">
                                            <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium rounded-md border
                                                    ${
                                                        filters.status === "All"
                                                            ? "bg-primary-600 text-white border-primary-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleStatusChange("All")
                                                }
                                            >
                                                {t("all")}
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium rounded-md border flex items-center justify-center
                                                    ${
                                                        filters.status ===
                                                        "waiting"
                                                            ? "bg-yellow-600 text-white border-yellow-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleStatusChange(
                                                        "waiting",
                                                    )
                                                }
                                            >
                                                <ClockIcon className="h-4 w-4 mr-1" />
                                                <span>{t("waiting")}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium rounded-md border flex items-center justify-center
                                                    ${
                                                        filters.status ===
                                                        "processing"
                                                            ? "bg-blue-600 text-white border-blue-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleStatusChange(
                                                        "processing",
                                                    )
                                                }
                                            >
                                                <ClockIcon className="h-4 w-4 mr-1 animate-spin" />
                                                <span>{t("processing")}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium rounded-md border flex items-center justify-center
                                                    ${
                                                        filters.status ===
                                                        "done"
                                                            ? "bg-green-600 text-white border-green-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleStatusChange("done")
                                                }
                                            >
                                                <CheckCircleIcon className="h-4 w-4 mr-1" />
                                                <span>{t("done")}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium rounded-md border flex items-center justify-center
                                                    ${
                                                        filters.status ===
                                                        "invalid"
                                                            ? "bg-orange-600 text-white border-orange-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleStatusChange(
                                                        "invalid",
                                                    )
                                                }
                                            >
                                                <XCircleIcon className="h-4 w-4 mr-1" />
                                                <span>{t("invalid")}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className={`px-3 py-2 text-sm font-medium rounded-md border flex items-center justify-center
                                                    ${
                                                        filters.status ===
                                                        "error"
                                                            ? "bg-red-600 text-white border-red-700"
                                                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                                onClick={() =>
                                                    handleStatusChange("error")
                                                }
                                            >
                                                <ExclamationCircleIcon className="h-4 w-4 mr-1" />
                                                <span>{t("error")}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Column 3: Date filter */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        {t("dateFilter")}
                                    </label>
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

                            {/* Active filters display */}
                            {(filters.client ||
                                filters.employee ||
                                filters.type !== "All" ||
                                filters.status !== "All" ||
                                filters.searchTerm ||
                                filters.dateOption !== "Last7Days") && (
                                <div className="mt-4 pt-3 border-t border-gray-200">
                                    <h4 className="text-xs font-medium text-gray-500 mb-2">
                                        {t("appliedFilters")}:
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {/* Client filter chip */}
                                        {filters.client && (
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                                                <span className="mr-1">👤</span>
                                                {filters.client.name}
                                                <button
                                                    onClick={() =>
                                                        handleClientSelect(null)
                                                    }
                                                    className="ml-1 text-primary-600 hover:text-primary-800"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Employee filter chip */}
                                        {filters.employee && (
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                                <UserIcon className="h-3 w-3 mr-1" />
                                                {filters.employee.employee_id}
                                                <button
                                                    onClick={() =>
                                                        handleEmployeeSelect(
                                                            null,
                                                        )
                                                    }
                                                    className="ml-1 text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Date filter chip */}
                                        {filters.dateOption !== "Last7Days" && (
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <CalendarIcon className="h-3 w-3 mr-1" />
                                                {filters.dateOption ===
                                                    "Custom" &&
                                                filters.customStartDate
                                                    ? `${filters.customStartDate.toLocaleDateString()} - ${
                                                          filters.customEndDate?.toLocaleDateString() ||
                                                          t("now")
                                                      }`
                                                    : t(
                                                          filters.dateOption.toLowerCase(),
                                                      )}
                                                <button
                                                    onClick={() =>
                                                        handleDateOptionChange(
                                                            "Last7Days",
                                                        )
                                                    }
                                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Type filter chip */}
                                        {filters.type !== "All" && (
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                {filters.type === "Download" ? (
                                                    <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                                                ) : (
                                                    <ArrowUpTrayIcon className="h-3 w-3 mr-1" />
                                                )}
                                                {t(filters.type.toLowerCase())}
                                                <button
                                                    onClick={() =>
                                                        handleTypeChange("All")
                                                    }
                                                    className="ml-1 text-purple-600 hover:text-purple-800"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Status filter chip */}
                                        {filters.status !== "All" && (
                                            <div
                                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                                                bg-green-100 text-green-800"
                                            >
                                                {filters.status === "done" && (
                                                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                )}
                                                {filters.status ===
                                                    "processing" && (
                                                    <ClockIcon className="h-3 w-3 mr-1 animate-spin" />
                                                )}
                                                {filters.status ===
                                                    "waiting" && (
                                                    <ClockIcon className="h-3 w-3 mr-1" />
                                                )}
                                                {filters.status ===
                                                    "invalid" && (
                                                    <XCircleIcon className="h-3 w-3 mr-1" />
                                                )}
                                                {filters.status === "error" && (
                                                    <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                                                )}
                                                {t(filters.status)}
                                                <button
                                                    onClick={() =>
                                                        handleStatusChange(
                                                            "All",
                                                        )
                                                    }
                                                    className="ml-1 text-green-600 hover:text-green-800"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}

                                        {/* Search term chip */}
                                        {filters.searchTerm && (
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                <MagnifyingGlassIcon className="h-3 w-3 mr-1" />
                                                {filters.searchTerm}
                                                <button
                                                    onClick={() =>
                                                        handleSearchChange("")
                                                    }
                                                    className="ml-1 text-blue-600 hover:text-blue-800"
                                                >
                                                    <XMarkIcon className="h-3 w-3" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Activity Table with loading states */}
                    <div className="mb-4">
                        {isLoading ? (
                            <div className="py-12 flex justify-center">
                                <div className="flex flex-col items-center">
                                    <ArrowPathIcon className="h-8 w-8 text-primary-600 animate-spin" />
                                    <p className="mt-2 text-sm text-gray-600">
                                        {t("loadingData")}
                                    </p>
                                </div>
                            </div>
                        ) : error ? (
                            <div className="py-12 flex justify-center">
                                <div className="flex flex-col items-center text-center max-w-md">
                                    <ExclamationCircleIcon className="h-12 w-12 text-red-500" />
                                    <p className="mt-2 text-lg font-medium text-red-800">
                                        {t("errorOccurred")}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        {error instanceof Error
                                            ? error.message
                                            : t("unknownError")}
                                    </p>
                                    <button
                                        onClick={handleRefresh}
                                        className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                                    >
                                        {t("retry")}
                                    </button>
                                </div>
                            </div>
                        ) : paginatedData.length === 0 ? (
                            <div className="py-12 flex justify-center">
                                <div className="flex flex-col items-center text-center max-w-md">
                                    <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400" />
                                    <p className="mt-2 text-lg font-medium text-gray-700">
                                        {t("noActivitiesFound")}
                                    </p>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {t("tryChangingFilters")}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <ActivityTable
                                activities={paginatedData as Activity[]}
                            />
                        )}
                    </div>

                    {/* Pagination - only show when we have data */}
                    {!isLoading && !error && paginatedData.length > 0 && (
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
                    )}
                </div>
            </div>
        </div>
    );
}
