// src/components/csv-manager/DownloadForm.tsx

import React from "react";
import {
    DocumentCheckIcon,
    ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";
import EnhancedAccountFilter from "./EnhancedAccountFilter";
import DataLayerFilter from "./DataLayerFilter";
import FilterPanel from "./FilterPanel";
import FilterTagsDisplay from "./FilterTagsDisplay";
import { MediaAccount, DataLayer, ColumnFilter } from "@/types";

interface DownloadFormProps {
    clientId: string | null;
    employeeId: string;
    selectedAccounts: MediaAccount[];
    selectedDataLayers: DataLayer[];
    filters: ColumnFilter[];
    isSubmitting: boolean;
    downloadSuccess: boolean;
    onEmployeeIdChange: (id: string) => void;
    onAccountChange: (accounts: MediaAccount[]) => void;
    onDataLayerChange: (layers: DataLayer[]) => void;
    onFilterChange: (filters: ColumnFilter[]) => void;
    onClearFilters: () => void;
    onSubmit: () => void;
}

/**
 * Form component for configuring CSV download request
 */
const DownloadForm: React.FC<DownloadFormProps> = ({
    clientId,
    employeeId,
    selectedAccounts,
    selectedDataLayers,
    filters,
    isSubmitting,
    downloadSuccess,
    onEmployeeIdChange,
    onAccountChange,
    onDataLayerChange,
    onFilterChange,
    onClearFilters,
    onSubmit,
}) => {
    // Mock columns for advanced filters
    const mockColumns = [
        "媒体ID",
        "CID",
        "アカウントID",
        "キャンペーンID",
        "キャンペーン名",
        "広告グループID",
        "広告グループ名",
        "広告ID",
        "キーワードID",
        "パラメ発行済みURL",
        "ドラフト停止日",
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="bg-primary-700 p-4 text-white">
                <h3 className="text-lg font-medium flex items-center">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    データダウンロードリクエスト (Data Download Request)
                </h3>
                <p className="text-sm text-primary-100 mt-1">
                    ダウンロードしたいデータを選択してください (Select the data
                    you want to download)
                </p>
            </div>

            <div className="p-5">
                {/* Filter Tags Display */}
                <FilterTagsDisplay
                    selectedAccounts={selectedAccounts}
                    filters={filters}
                    onClearFilters={onClearFilters}
                />

                {/* Form Fields */}
                <div className="space-y-6">
                    {/* Employee ID Field - Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            社員ID (Employee ID){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={employeeId}
                                onChange={e =>
                                    onEmployeeIdChange(e.target.value)
                                }
                                placeholder="社員IDを入力してください (Enter your employee ID)"
                                className="w-1/2 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                required
                            />
                            {!employeeId.trim() && (
                                <p className="mt-1 text-sm text-red-500">
                                    社員IDは必須です (Employee ID is required)
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Account Filter - Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            アカウント選択 (Account Selection){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <EnhancedAccountFilter
                            clientId={clientId}
                            selectedAccounts={selectedAccounts}
                            onAccountChange={onAccountChange}
                        />
                        {selectedAccounts.length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                少なくとも1つのアカウントを選択してください
                                (Please select at least one account)
                            </p>
                        )}
                    </div>

                    {/* Data Layer Filter - No longer selected by default */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            データ層選択 (Data Layer Selection){" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <DataLayerFilter
                            selectedLayers={selectedDataLayers}
                            onLayerChange={onDataLayerChange}
                            defaultSelectAll={false} // Set to false to prevent default selection
                        />
                        {selectedDataLayers.length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                少なくとも1つのデータ層を選択してください
                                (Please select at least one data layer)
                            </p>
                        )}
                    </div>

                    {/* Advanced Filter Panel */}
                    <div className="mt-3">
                        <FilterPanel
                            filters={filters}
                            onFilterChange={onFilterChange}
                            columns={mockColumns}
                        />

                        <div className="mt-3 text-xs text-gray-500">
                            詳細フィルターを使用して、より具体的な条件でデータをフィルタリングします。
                            (Use advanced filters to filter data with more
                            specific conditions.)
                        </div>
                    </div>

                    {/* Success Message */}
                    {downloadSuccess && (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                            <div className="flex">
                                <DocumentCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">
                                        リクエストが正常に送信されました
                                        (Request successfully submitted)
                                    </p>
                                    <p className="text-xs text-green-700 mt-1">
                                        処理が完了するとメールで通知されます
                                        (You will be notified by email when
                                        processing is complete)
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onSubmit}
                            disabled={
                                selectedAccounts.length === 0 ||
                                selectedDataLayers.length === 0 ||
                                !employeeId.trim() ||
                                isSubmitting
                            }
                            className={`inline-flex items-center px-6 py-3 shadow-sm text-sm font-medium rounded-md text-white
                ${
                    selectedAccounts.length === 0 ||
                    selectedDataLayers.length === 0 ||
                    !employeeId.trim()
                        ? "bg-gray-400 cursor-not-allowed"
                        : isSubmitting
                        ? "bg-primary-600 opacity-75 cursor-wait"
                        : "bg-primary-600 hover:bg-primary-700"
                }
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                        >
                            {isSubmitting ? (
                                <>
                                    <svg
                                        className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        ></circle>
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        ></path>
                                    </svg>
                                    処理中... (Processing...)
                                </>
                            ) : (
                                <>
                                    <DocumentCheckIcon className="h-5 w-5 mr-2" />
                                    保存 (Save)
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DownloadForm;
