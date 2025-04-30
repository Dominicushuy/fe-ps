// src/components/csv-manager/DownloadForm.tsx

import React from "react";
import { useTranslations } from "next-intl";
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
    selectedAccounts: MediaAccount[];
    selectedDataLayers: DataLayer[];
    filters: ColumnFilter[];
    isSubmitting: boolean;
    downloadSuccess: boolean;
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
    selectedAccounts,
    selectedDataLayers,
    filters,
    isSubmitting,
    downloadSuccess,
    onAccountChange,
    onDataLayerChange,
    onFilterChange,
    onClearFilters,
    onSubmit,
}) => {
    const t = useTranslations();

    // Filtered columns list - removed "媒体ID", "CID", "アカウントID", "ドラフト停止日"
    const mockColumns = [
        "キャンペーンID",
        "キャンペーン名",
        "広告グループID",
        "広告グループ名",
        "広告ID",
        "キーワードID",
        "パラメ発行済みURL",
    ];

    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="bg-primary-700 p-4 text-white">
                <h3 className="text-lg font-medium flex items-center">
                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                    {t("dataDownloadRequest")}
                </h3>
                <p className="text-sm text-primary-100 mt-1">
                    {t("selectDataToDownload")}
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
                    {/* Account Filter - Required */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("accountSelection")}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <EnhancedAccountFilter
                            clientId={clientId}
                            selectedAccounts={selectedAccounts}
                            onAccountChange={onAccountChange}
                        />
                        {selectedAccounts.length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                {t("pleaseSelectAtLeastOneAccount")}
                            </p>
                        )}
                    </div>

                    {/* Data Layer Filter - No longer selected by default */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t("dataLayerSelection")}{" "}
                            <span className="text-red-500">*</span>
                        </label>
                        <DataLayerFilter
                            selectedLayers={selectedDataLayers}
                            onLayerChange={onDataLayerChange}
                            defaultSelectAll={false} // Set to false to prevent default selection
                        />
                        {selectedDataLayers.length === 0 && (
                            <p className="mt-1 text-sm text-red-500">
                                {t("pleaseSelectAtLeastOneDataLayer")}
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
                            {t("advancedFiltersDescription")}
                        </div>
                    </div>

                    {/* Success Message */}
                    {downloadSuccess && (
                        <div className="p-4 bg-green-50 border border-green-100 rounded-md">
                            <div className="flex">
                                <DocumentCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                                <div>
                                    <p className="text-sm font-medium text-green-800">
                                        {t("requestSuccessfullySubmitted")}
                                    </p>
                                    <p className="text-xs text-green-700 mt-1">
                                        {t("checkProcessStatusInActivityLog")}
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
                                isSubmitting
                            }
                            className={`inline-flex items-center px-6 py-3 shadow-sm text-sm font-medium rounded-md text-white
                ${
                    selectedAccounts.length === 0 ||
                    selectedDataLayers.length === 0
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
                                    {t("processing")}
                                </>
                            ) : (
                                <>
                                    <DocumentCheckIcon className="h-5 w-5 mr-2" />
                                    {t("save")}
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
