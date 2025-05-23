"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
    PlusIcon,
    MinusIcon,
    AdjustmentsHorizontalIcon,
    ChevronUpIcon,
    ChevronDownIcon,
    TrashIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";
import { ColumnFilter, FilterOperator } from "@/types";
import FilterItem, { operatorNeedsValue } from "./FilterItem";
import { createNewFilter } from "@/lib/utils/filter-utils";

interface FilterPanelProps {
    filters: ColumnFilter[];
    onFilterChange: (filters: ColumnFilter[]) => void;
    columns: string[];
}

export default function FilterPanel({
    filters,
    onFilterChange,
    columns,
}: FilterPanelProps) {
    const t = useTranslations();
    const [isExpanded, setIsExpanded] = useState(true);

    // Thêm một filter mới
    const handleAddFilter = () => {
        // Sử dụng hàm createNewFilter từ filter-utils để tạo filter mới với operator hợp lệ
        const newFilter = createNewFilter(columns[0]);
        onFilterChange([...filters, newFilter]);
        setIsExpanded(true); // Mở rộng panel khi thêm filter mới
    };

    // Xóa một filter
    const handleRemoveFilter = (filterId: string) => {
        onFilterChange(filters.filter(filter => filter.id !== filterId));
    };

    // Cập nhật một filter
    const handleFilterChange = (updatedFilter: ColumnFilter) => {
        onFilterChange(
            filters.map(filter =>
                filter.id === updatedFilter.id ? updatedFilter : filter,
            ),
        );
    };

    // Xóa tất cả các filter
    const handleClearAllFilters = () => {
        onFilterChange([]);
    };

    // Helper function to get operator symbol for display
    const getOperatorSymbol = (operator: FilterOperator): string => {
        switch (operator) {
            case "ALL":
                return t("all");
            case "CASE_CONTAIN_AND":
            case "CONTAIN_AND":
                return t("containsAnd");
            case "CASE_CONTAIN_OR":
            case "CONTAIN_OR":
                return t("containsOr");
            case "CASE_NOT_CONTAIN":
            case "NOT_CONTAIN":
                return t("notContains");
            case "CASE_START_WITH":
            case "START_WITH":
                return t("startsWith");
            case "CASE_END_WITH":
            case "END_WITH":
                return t("endsWith");
            case "CASE_EQUAL":
            case "EQUAL":
                return "=";
            case "CASE_NOT_EQUAL":
            case "NOT_EQUAL":
                return "≠";
            case "other":
                return t("other");
            default:
                return "";
        }
    };

    return (
        <div className="w-full bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            {/* Header của FilterPanel */}
            <div
                className={`flex items-center justify-between p-3 cursor-pointer rounded-t-lg transition-all ${
                    isExpanded
                        ? "bg-primary-50 border-b border-primary-100"
                        : "bg-gray-50 hover:bg-gray-100"
                }`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center">
                    <AdjustmentsHorizontalIcon className="h-5 w-5 text-primary-700 mr-2" />
                    <h3 className="text-sm font-medium text-gray-700">
                        {t("advancedFilters")}
                    </h3>
                    {filters.length > 0 && (
                        <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-primary-100 text-primary-800 rounded-full">
                            {filters.length}
                        </span>
                    )}
                </div>
                <div className="flex items-center">
                    {filters.length > 0 && (
                        <button
                            type="button"
                            onClick={e => {
                                e.stopPropagation();
                                handleClearAllFilters();
                            }}
                            className="flex items-center text-xs text-gray-500 hover:text-red-500 mr-3 transition-colors"
                            title={t("clearAll")}
                        >
                            <TrashIcon className="h-3 w-3 mr-1" />
                            {t("clearAll")}
                        </button>
                    )}
                    {isExpanded ? (
                        <ChevronUpIcon className="h-4 w-4 text-gray-500" />
                    ) : (
                        <ChevronDownIcon className="h-4 w-4 text-gray-500" />
                    )}
                </div>
            </div>

            {/* Body của FilterPanel */}
            {isExpanded && (
                <div className="p-4">
                    {/* Danh sách các filters */}
                    <div className="space-y-3">
                        {filters.length > 0 ? (
                            filters.map(filter => (
                                <FilterItem
                                    key={filter.id}
                                    filter={filter}
                                    columns={columns}
                                    onFilterChange={handleFilterChange}
                                    onRemoveFilter={() =>
                                        handleRemoveFilter(filter.id)
                                    }
                                />
                            ))
                        ) : (
                            <div className="py-6 text-center">
                                <FunnelIcon className="mx-auto h-8 w-8 text-gray-300" />
                                <p className="mt-2 text-gray-500 text-sm">
                                    {t("noFilters")}
                                </p>
                                <p className="text-gray-400 text-xs mt-1">
                                    {t("clickButtonToFilterData")}
                                </p>
                            </div>
                        )}

                        {/* Button thêm filter */}
                        <div
                            className={`pt-3 ${
                                filters.length > 0
                                    ? "border-t border-gray-100"
                                    : ""
                            }`}
                        >
                            <button
                                type="button"
                                onClick={handleAddFilter}
                                className="w-full sm:w-auto flex items-center justify-center px-4 py-2 text-sm text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                            >
                                <PlusIcon className="h-4 w-4 mr-1" />
                                {t("addFilter")}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hiển thị thông tin các filter khi panel thu gọn */}
            {!isExpanded && filters.length > 0 && (
                <div className="px-3 pb-3">
                    <div className="flex flex-wrap gap-2 mt-2">
                        {filters.map(filter => (
                            <div
                                key={filter.id}
                                className="flex items-center bg-primary-50 text-primary-800 text-xs font-medium px-2 py-1 rounded-full border border-primary-100 hover:bg-primary-100 transition-colors"
                            >
                                <span className="font-medium truncate max-w-[100px]">
                                    {filter.columnName}
                                </span>
                                <span className="mx-1 text-primary-600">
                                    {getOperatorSymbol(filter.operator)}
                                </span>
                                {operatorNeedsValue(filter.operator) && (
                                    <span className="truncate max-w-[80px] text-primary-700">
                                        {filter.value || "(empty)"}
                                    </span>
                                )}
                                <button
                                    type="button"
                                    onClick={e => {
                                        e.stopPropagation();
                                        handleRemoveFilter(filter.id);
                                    }}
                                    className="ml-1 text-primary-700 hover:text-red-500 transition-colors"
                                    title={t("remove")}
                                >
                                    <MinusIcon className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
