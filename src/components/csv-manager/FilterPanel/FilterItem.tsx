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
    // Danh sách các toán tử lọc với nhãn tiếng Nhật và tiếng Anh - đã loại bỏ "ALL" và "other"
    const operators: { value: FilterOperator; label: string }[] = [
        {
            value: "CASE_CONTAIN_AND",
            label: "(複数)テキスト: 含む AND (Text: Contains AND)",
        },
        {
            value: "CASE_CONTAIN_OR",
            label: "(複数)テキスト: 含む OR (Text: Contains OR)",
        },
        {
            value: "CASE_NOT_CONTAIN",
            label: "(複数)テキスト: 含まない (Text: Not Contains)",
        },
        {
            value: "CASE_START_WITH",
            label: "(複数)テキスト: 次で始まる (Text: Starts With)",
        },
        {
            value: "CASE_END_WITH",
            label: "(複数)テキスト: 次で終わる (Text: Ends With)",
        },
        { value: "CASE_EQUAL", label: "(複数)テキスト: 等しい (Text: Equals)" },
        {
            value: "CASE_NOT_EQUAL",
            label: "(複数)テキスト: 等しくない (Text: Not Equals)",
        },
        {
            value: "CONTAIN_AND",
            label: "(複数)テキスト: 含む(小文字) AND (Text: Contains AND - Lowercase)",
        },
        {
            value: "CONTAIN_OR",
            label: "(複数)テキスト: 含む(小文字) OR (Text: Contains OR - Lowercase)",
        },
        {
            value: "NOT_CONTAIN",
            label: "(複数)テキスト: 含まない(小文字) (Text: Not Contains - Lowercase)",
        },
        {
            value: "START_WITH",
            label: "(複数)テキスト: 次で始まる(小文字) (Text: Starts With - Lowercase)",
        },
        {
            value: "END_WITH",
            label: "(複数)テキスト: 次で終わる(小文字) (Text: Ends With - Lowercase)",
        },
        {
            value: "EQUAL",
            label: "(複数)テキスト: 等しい(小文字) (Text: Equals - Lowercase)",
        },
        {
            value: "NOT_EQUAL",
            label: "(複数)テキスト: 等しくない(小文字) (Text: Not Equals - Lowercase)",
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

            {/* Nhập giá trị (luôn hiển thị vì đã bỏ các toán tử không cần value) */}
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
                    各行は別々の値として処理されます (Each line is treated as a
                    separate value)
                </p>
            </div>

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
