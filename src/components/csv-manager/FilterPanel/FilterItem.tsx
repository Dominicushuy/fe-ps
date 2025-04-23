import React from "react";
import { ColumnFilter, FilterOperator } from "@/types";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface FilterItemProps {
    filter: ColumnFilter;
    columns: string[];
    onFilterChange: (filter: ColumnFilter) => void;
    onRemoveFilter: () => void;
}

export default function FilterItem({
    filter,
    columns,
    onFilterChange,
    onRemoveFilter,
}: FilterItemProps) {
    // Danh sách các toán tử lọc với nhãn tiếng Nhật và tiếng Anh
    const operators: { value: FilterOperator; label: string }[] = [
        { value: "all", label: "全て (All)" },
        { value: "contains", label: "(複数)テキスト: 含む (Text: Contains)" },
        {
            value: "notContains",
            label: "(複数)テキスト: 含まない (Text: Not Contains)",
        },
        {
            value: "startsWith",
            label: "(複数)テキスト: 次で始まる (Text: Starts With)",
        },
        {
            value: "endsWith",
            label: "(複数)テキスト: 次で終わる (Text: Ends With)",
        },
        { value: "equals", label: "(複数)テキスト: 等しい (Text: Equals)" },
        {
            value: "notEquals",
            label: "(複数)テキスト: 等しくない (Text: Not Equals)",
        },
        {
            value: "containsLowerCase",
            label: "(複数)テキスト: 含む(小文字) (Text: Contains - Lowercase)",
        },
        {
            value: "notContainsLowerCase",
            label: "(複数)テキスト: 含まない(小文字) (Text: Not Contains - Lowercase)",
        },
        {
            value: "startsWithLowerCase",
            label: "(複数)テキスト: 次で始まる(小文字) (Text: Starts With - Lowercase)",
        },
        {
            value: "endsWithLowerCase",
            label: "(複数)テキスト: 次で終わる(小文字) (Text: Ends With - Lowercase)",
        },
        {
            value: "equalsLowerCase",
            label: "(複数)テキスト: 等しい(小文字) (Text: Equals - Lowercase)",
        },
        {
            value: "notEqualsLowerCase",
            label: "(複数)テキスト: 等しくない(小文字) (Text: Not Equals - Lowercase)",
        },
        { value: "other", label: "上記以外 （残り） (Other)" },
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
            // Reset giá trị nếu chuyển sang toán tử không cần giá trị
            value: !operatorNeedsValue(e.target.value as FilterOperator)
                ? ""
                : filter.value,
        });
    };

    // Cập nhật giá trị trong filter
    const handleValueChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onFilterChange({
            ...filter,
            value: e.target.value,
        });
    };

    // Kiểm tra xem toán tử có cần giá trị nhập vào không
    const operatorNeedsValue = (operator: FilterOperator): boolean => {
        return operator !== "all" && operator !== "other";
    };

    return (
        <div className="flex flex-wrap items-start gap-3 bg-gray-50 p-4 rounded-md border border-gray-200 hover:border-primary-300 transition-all duration-200">
            {/* Chọn cột */}
            <div className="w-full sm:w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1">
                    カラム (Column)
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
                    演算子 (Operator)
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

            {/* Nhập giá trị (nếu toán tử cần giá trị) */}
            {operatorNeedsValue(filter.operator) ? (
                <div className="w-full sm:w-1/4">
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                        値 (Value)
                    </label>
                    <textarea
                        value={filter.value}
                        onChange={handleValueChange}
                        placeholder="値を入力... (1行ごとに1つの値)"
                        className="block w-full min-h-10 py-2 px-3 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50 sm:text-sm transition-all resize-y"
                        rows={3}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                        各行は別々の値として処理されます (Each line is treated
                        as a separate value)
                    </p>
                </div>
            ) : (
                <div className="w-full sm:w-1/4 flex items-end">
                    <div className="h-10"></div>
                </div>
            )}

            {/* Nút xóa filter - fixed alignment */}
            <div className="flex items-start sm:pt-6">
                <button
                    type="button"
                    onClick={onRemoveFilter}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white h-10 w-10 text-gray-400 hover:bg-red-50 hover:text-red-500 hover:border-red-300 transition-colors"
                    title="削除 (Remove)"
                >
                    <XMarkIcon className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

// Export function để kiểm tra xem toán tử có cần giá trị nhập vào không
export function operatorNeedsValue(operator: FilterOperator): boolean {
    return operator !== "all" && operator !== "other";
}
