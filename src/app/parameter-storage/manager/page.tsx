"use client";

import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ModeToggle from "@/components/csv-manager/ModeToggle";
import ClientSelect from "@/components/csv-manager/ClientSelect";
import UploadZone from "@/components/csv-manager/UploadZone";
import CSVPreview from "@/components/csv-manager/CSVPreview";
import DataTable from "@/components/csv-manager/DataTable";
import SearchBar from "@/components/csv-manager/SearchBar";
import Pagination from "@/components/csv-manager/Pagination";
import FilterPanel from "@/components/csv-manager/FilterPanel";
import { CSVManagerMode } from "@/types";
import { useCSVManager } from "@/hooks/useCSVManager";
import ConfirmClientChangeDialog from "@/components/csv-manager/ConfirmClientChangeDialog";
import NavigationConfirmDialog from "@/components/csv-manager/NavigationConfirmDialog";
// Import new filter components
import EnhancedAccountFilter from "@/components/csv-manager/EnhancedAccountFilter";
// Import updated DataLayerFilter
import DataLayerFilter from "@/components/csv-manager/DataLayerFilter";
import FilterTags from "@/components/csv-manager/FilterTags";
// Icons
import {
    ArrowDownTrayIcon,
    EyeIcon,
    DocumentCheckIcon,
    ExclamationCircleIcon,
    FunnelIcon,
} from "@heroicons/react/24/outline";

export default function CSVManagerPage() {
    const {
        mode,
        selectedClient,
        file,
        data,
        isSubmitting,
        filters,
        searchTerm,
        currentPage,
        itemsPerPage,
        showClientChangeConfirm,
        pendingClientChange,
        showNavigationConfirm,
        selectedAccounts,
        selectedDataLayers,
        handleModeChange,
        handleClientSelect,
        handleFileSelect,
        handleValidationComplete,
        handleSubmitData,
        setFilters,
        handleSearch,
        handlePageChange,
        handleItemsPerPageChange,
        handleFilterChange,
        handleConfirmClientChange,
        handleCancelClientChange,
        handleNavigateToActivityLog,
        handleCloseNavigationDialog,
        handleAccountSelect,
        handleDataLayerSelect,
    } = useCSVManager();

    // State for download form submission and preview toggle
    const [isDownloadSubmitting, setIsDownloadSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

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

    // Handle download form submission
    const handleDownloadSubmit = () => {
        if (selectedAccounts.length === 0) {
            alert("アカウントを選択してください (Please select accounts)");
            return;
        }

        if (selectedDataLayers.length === 0) {
            alert("データ層を選択してください (Please select data layers)");
            return;
        }

        setIsDownloadSubmitting(true);

        // Simulate API call to create download process
        setTimeout(() => {
            console.log("Download process initiated with:", {
                client: selectedClient,
                accounts: selectedAccounts,
                dataLayers: selectedDataLayers,
                advancedFilters: filters,
            });

            setIsDownloadSubmitting(false);
            setDownloadSuccess(true);

            // Reset success message after 5 seconds
            setTimeout(() => setDownloadSuccess(false), 5000);
        }, 1500);
    };

    return (
        <div className="space-y-8">
            {/* Toast Container */}
            <ToastContainer />

            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h2 className="text-xl font-semibold mb-6 text-primary-900 border-b border-primary-100 pb-3">
                    Parame Storage Manager
                </h2>

                {/* Mode Selector */}
                <div className="mb-6">
                    <ModeToggle
                        currentMode={mode}
                        onModeChange={handleModeChange}
                    />
                </div>

                {/* Client Selector */}
                <div className="mb-6">
                    <ClientSelect
                        selectedClient={selectedClient}
                        onClientSelect={handleClientSelect}
                    />
                </div>

                {/* Confirmation Dialog for Client Change */}
                <ConfirmClientChangeDialog
                    isOpen={showClientChangeConfirm}
                    onClose={handleCancelClientChange}
                    onConfirm={handleConfirmClientChange}
                    currentClient={selectedClient}
                    newClient={pendingClientChange}
                />

                {/* Navigation Confirmation Dialog */}
                <NavigationConfirmDialog
                    isOpen={showNavigationConfirm}
                    onClose={handleCloseNavigationDialog}
                    onConfirm={handleNavigateToActivityLog}
                    client={selectedClient}
                />

                {/* UPLOAD MODE */}
                {mode === CSVManagerMode.UPLOAD && (
                    <div className="space-y-6">
                        {/* Upload Zone */}
                        <UploadZone
                            externalFile={file}
                            onFileSelect={handleFileSelect}
                            disabled={!selectedClient}
                        />

                        {/* Hiển thị thông báo nếu chưa chọn client */}
                        {!selectedClient && (
                            <p className="mt-2 text-sm text-amber-600">
                                ファイルをアップロードする前にクライアントを選択してください。
                                (Please select a client before uploading files.)
                            </p>
                        )}

                        {/* CSV Preview - hiển thị khi có file được chọn */}
                        {file && (
                            <CSVPreview
                                file={file}
                                selectedClient={selectedClient}
                                onValidationComplete={handleValidationComplete}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmitData}
                            />
                        )}
                    </div>
                )}

                {/* DOWNLOAD MODE */}
                {mode === CSVManagerMode.DOWNLOAD && (
                    <div className="space-y-6">
                        {/* Download form card */}
                        <div className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                            <div className="bg-primary-700 p-4 text-white">
                                <h3 className="text-lg font-medium flex items-center">
                                    <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                                    データダウンロードリクエスト (Data Download
                                    Request)
                                </h3>
                                <p className="text-sm text-primary-100 mt-1">
                                    ダウンロードしたいデータを選択してください
                                    (Select the data you want to download)
                                </p>
                            </div>

                            <div className="p-5">
                                {/* Filter Tags */}
                                {(selectedAccounts.length > 0 ||
                                    filters.length > 0) && (
                                    <div className="mb-5 bg-blue-50 p-3 rounded-lg border border-blue-100">
                                        <h4 className="text-sm font-medium text-blue-700 mb-2">
                                            適用フィルター (Applied Filters)
                                        </h4>

                                        {selectedAccounts.length > 0 && (
                                            <FilterTags
                                                selectedMedia={[]}
                                                selectedAccounts={
                                                    selectedAccounts
                                                }
                                                selectedDataLayers={[]} // Don't show data layer tags since they're all selected by default
                                                onRemoveAccount={accountId =>
                                                    handleAccountSelect(
                                                        selectedAccounts.filter(
                                                            a =>
                                                                a.id !==
                                                                accountId,
                                                        ),
                                                    )
                                                }
                                            />
                                        )}

                                        {filters.length > 0 && (
                                            <div className="mt-2">
                                                <div className="flex items-center">
                                                    <FunnelIcon className="h-4 w-4 text-blue-600 mr-1" />
                                                    <span className="text-xs font-medium text-blue-700">
                                                        Advanced filters:{" "}
                                                        {filters.length}
                                                    </span>
                                                    {filters.length > 0 && (
                                                        <button
                                                            onClick={() =>
                                                                setFilters([])
                                                            }
                                                            className="ml-2 text-xs text-red-600 hover:text-red-800"
                                                        >
                                                            クリア (Clear)
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    {/* Account Filter - Required */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            アカウント選択 (Account Selection){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <EnhancedAccountFilter
                                            selectedAccounts={selectedAccounts}
                                            onAccountChange={
                                                handleAccountSelect
                                            }
                                        />
                                        {selectedAccounts.length === 0 && (
                                            <p className="mt-1 text-sm text-red-500">
                                                少なくとも1つのアカウントを選択してください
                                                (Please select at least one
                                                account)
                                            </p>
                                        )}
                                    </div>

                                    {/* Data Layer Filter - Already selected by default */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            データ層選択 (Data Layer Selection){" "}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </label>
                                        <DataLayerFilter
                                            selectedLayers={selectedDataLayers}
                                            onLayerChange={
                                                handleDataLayerSelect
                                            }
                                            defaultSelectAll={true} // Pass prop to select all by default
                                        />
                                    </div>

                                    {/* Advanced Filter Toggle */}
                                    <div className="mt-3 ">
                                        <FilterPanel
                                            filters={filters}
                                            onFilterChange={handleFilterChange}
                                            columns={mockColumns}
                                        />

                                        <div className="mt-3 text-xs text-gray-500">
                                            詳細フィルターを使用して、より具体的な条件でデータをフィルタリングします。
                                            (Use advanced filters to filter data
                                            with more specific conditions.)
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
                                                        (Request successfully
                                                        submitted)
                                                    </p>
                                                    <p className="text-xs text-green-700 mt-1">
                                                        処理が完了するとメールで通知されます
                                                        (You will be notified by
                                                        email when processing is
                                                        complete)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowPreview(!showPreview)
                                            }
                                            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                        >
                                            <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            プレビューを{" "}
                                            {showPreview ? "隠す" : "表示"}{" "}
                                            (Toggle Preview)
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleDownloadSubmit}
                                            disabled={
                                                selectedAccounts.length === 0 ||
                                                selectedDataLayers.length ===
                                                    0 ||
                                                isDownloadSubmitting
                                            }
                                            className={`inline-flex items-center px-6 py-3 shadow-sm text-sm font-medium rounded-md text-white
                        ${
                            selectedAccounts.length === 0 ||
                            selectedDataLayers.length === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : isDownloadSubmitting
                                ? "bg-primary-600 opacity-75 cursor-wait"
                                : "bg-primary-600 hover:bg-primary-700"
                        }
                        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                        >
                                            {isDownloadSubmitting ? (
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

                        {/* Preview Section */}
                        {showPreview && (
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <div className="bg-gray-100 p-3 border-b border-gray-200 flex items-center justify-between">
                                    <h3 className="text-md font-medium text-gray-700 flex items-center">
                                        <EyeIcon className="h-5 w-5 mr-2 text-gray-500" />
                                        データプレビュー (Data Preview)
                                    </h3>

                                    <div className="text-sm text-gray-500">
                                        <ExclamationCircleIcon className="h-4 w-4 inline mr-1 text-amber-500" />
                                        これはプレビューです。完全なデータはリクエスト処理後に利用可能になります。
                                        (This is a preview. Complete data will
                                        be available after request processing.)
                                    </div>
                                </div>

                                <div className="p-4">
                                    {/* Search and Preview Controls */}
                                    <div className="mb-4">
                                        <SearchBar
                                            searchTerm={searchTerm}
                                            onSearch={handleSearch}
                                            placeholder="プレビューを検索... (Search preview...)"
                                        />
                                    </div>

                                    {data.length > 0 ? (
                                        <>
                                            {/* Data Table Preview */}
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
                                                    onPageChange={
                                                        handlePageChange
                                                    }
                                                    onItemsPerPageChange={
                                                        handleItemsPerPageChange
                                                    }
                                                    maxPageButtons={5}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <div className="text-center py-10">
                                            <p className="text-gray-500">
                                                プレビューデータはありません (No
                                                preview data available)
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
