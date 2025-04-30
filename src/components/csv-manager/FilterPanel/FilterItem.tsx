import React from "react";
import { useTranslations } from "next-intl";
import { ColumnFilter, FilterOperator } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterItemProps {
    filter: ColumnFilter;
    columns: string[];
    onFilterChange: (filter: ColumnFilter) => void;
    onRemoveFilter: () => void;
}

export function operatorNeedsValue(operator: FilterOperator): boolean {
    return operator !== "ALL" && operator !== "other";
}

export default function FilterItem({
    filter,
    columns,
    onFilterChange,
    onRemoveFilter,
}: FilterItemProps) {
    const t = useTranslations();

    // Danh sách các toán tử lọc với nhãn tiếng Nhật và tiếng Anh - đã loại bỏ "ALL" và "other"
    const operators: { value: FilterOperator; label: string }[] = [
        {
            value: "CASE_CONTAIN_AND",
            label: t("operatorContainsAnd"),
        },
        {
            value: "CASE_CONTAIN_OR",
            label: t("operatorContainsOr"),
        },
        {
            value: "CASE_NOT_CONTAIN",
            label: t("operatorNotContains"),
        },
        {
            value: "CASE_START_WITH",
            label: t("operatorStartsWith"),
        },
        {
            value: "CASE_END_WITH",
            label: t("operatorEndsWith"),
        },
        { value: "CASE_EQUAL", label: t("operatorEquals") },
        {
            value: "CASE_NOT_EQUAL",
            label: t("operatorNotEquals"),
        },
        {
            value: "CONTAIN_AND",
            label: t("operatorContainsAndLowercase"),
        },
        {
            value: "CONTAIN_OR",
            label: t("operatorContainsOrLowercase"),
        },
        {
            value: "NOT_CONTAIN",
            label: t("operatorNotContainsLowercase"),
        },
        {
            value: "START_WITH",
            label: t("operatorStartsWithLowercase"),
        },
        {
            value: "END_WITH",
            label: t("operatorEndsWithLowercase"),
        },
        {
            value: "EQUAL",
            label: t("operatorEqualsLowercase"),
        },
        {
            value: "NOT_EQUAL",
            label: t("operatorNotEqualsLowercase"),
        },
    ];

    // Cập nhật tên cột trong filter
    const handleColumnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filter,
            columnName: e.target.value,
        });
    };

    // Cập nhật toán tử trong filter
    const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        onFilterChange({
            ...filter,
            operator: e.target.value as FilterOperator,
        });
    };

    // Cập nhật giá trị trong filter
    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onFilterChange({
            ...filter,
            value: e.target.value,
        });
    };

    return (
        <div className="flex flex-wrap items-start gap-3 bg-gray-50 p-4 rounded-md border border-gray-200 hover:border-primary-300 transition-all duration-200">
            {/* Chọn cột */}
            <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("column")}
                </label>
                <select
                    value={filter.columnName}
                    onChange={handleColumnChange}
                    className="block w-full h-10 py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 sm:text-sm transition-all"
                >
                    {columns.map(column => (
                        <option key={column} value={column}>
                            {column}
                        </option>
                    ))}
                </select>
            </div>

            {/* Chọn toán tử */}
            <div className="w-full sm:w-2/5">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("operator")}
                </label>
                <select
                    value={filter.operator}
                    onChange={handleOperatorChange}
                    className="block w-full h-10 py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 sm:text-sm transition-all"
                >
                    {operators.map(op => (
                        <option key={op.value} value={op.value}>
                            {op.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Nhập giá trị (luôn hiển thị vì đã bỏ các toán tử không cần value) */}
            <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    {t("value")}
                </label>
                <textarea
                    value={filter.value}
                    onChange={handleValueChange}
                    placeholder={t("enterValuePerLine")}
                    className="block w-full min-h-10 py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 sm:text-sm transition-all resize-y"
                    rows={3}
                />
                <p className="mt-1 text-xs text-gray-400">
                    {t("eachLineTreatedAsValue")}
                </p>
            </div>

            {/* Nút xóa filter - fixed alignment */}
            <div className="flex items-start sm:pt-6">
                <button
                    type="button"
                    onClick={onRemoveFilter}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white h-10 w-10 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors"
                    title={t("remove")}
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}
