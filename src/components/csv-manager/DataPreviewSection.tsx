// src/components/csv-manager/DataPreviewSection.tsx

import React from "react";
import { EyeIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import SearchBar from "./SearchBar";
import DataTable from "./DataTable";
import Pagination from "./Pagination";
import { ColumnFilter, CSVRow } from "@/types";

interface DataPreviewSectionProps {
    showPreview: boolean;
    data: CSVRow[];
    currentPage: number;
    itemsPerPage: number;
    filters: ColumnFilter[];
    searchTerm: string;
    onSearchChange: (term: string) => void;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
    onTogglePreview: () => void;
}

/**
 * Component for displaying data preview with search and pagination
 */
const DataPreviewSection: React.FC<DataPreviewSectionProps> = ({
    showPreview,
    data,
    currentPage,
    itemsPerPage,
    filters,
    searchTerm,
    onSearchChange,
    onPageChange,
    onItemsPerPageChange,
    onTogglePreview,
}) => {
    if (!showPreview) {
        return (
            <div className="mt-4">
                <button
                    type="button"
                    onClick={onTogglePreview}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                    <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
                    プレビューを表示 (Show Preview)
                </button>
            </div>
        );
    }

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-md font-medium text-gray-700 flex items-center">
                    <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
                    データプレビュー (Data Preview)
                </h3>

                <div className="flex items-center">
                    <div className="text-sm text-gray-500 mr-4">
                        <ExclamationCircleIcon className="h-4 w-4 inline mr-1 text-amber-500" />
                        これはプレビューです。完全なデータはリクエスト処理後に利用可能になります。
                        (This is a preview. Complete data will be available
                        after request processing.)
                    </div>

                    <button
                        type="button"
                        onClick={onTogglePreview}
                        className="inline-flex items-center px-2 py-1 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-primary-500"
                    >
                        プレビューを隠す (Hide Preview)
                    </button>
                </div>
            </div>

            <div className="p-4">
                {/* Search Controls */}
                <div className="mb-4">
                    <SearchBar
                        searchTerm={searchTerm}
                        onSearch={onSearchChange}
                        placeholder="プレビューを検索... (Search preview...)"
                    />
                </div>

                {data.length > 0 ? (
                    <>
                        {/* Data Table */}
                        <DataTable
                            data={data}
                            currentPage={currentPage}
                            itemsPerPage={itemsPerPage}
                            filters={filters}
                            searchTerm={searchTerm}
                            isDownloadMode
                        />

                        {/* Pagination */}
                        <div className="mt-4">
                            <Pagination
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                totalItems={data.length}
                                onPageChange={onPageChange}
                                onItemsPerPageChange={onItemsPerPageChange}
                                maxPageButtons={5}
                            />
                        </div>
                    </>
                ) : (
                    <div className="text-center py-10">
                        <p className="text-gray-500">
                            プレビューデータはありません (No preview data
                            available)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DataPreviewSection;
