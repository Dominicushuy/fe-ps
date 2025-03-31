"use client";

import React from "react";
import ModeToggle from "@/components/csv-manager/ModeToggle";
import ClientSelect from "@/components/csv-manager/ClientSelect";
import UploadZone from "@/components/csv-manager/UploadZone";
import CSVPreview from "@/components/csv-manager/CSVPreview";
import DataTable from "@/components/csv-manager/DataTable";
import FilterPanel from "@/components/csv-manager/FilterPanel";
import SearchBar from "@/components/csv-manager/SearchBar";
import Pagination from "@/components/csv-manager/Pagination";
import DownloadButton from "@/components/csv-manager/DownloadButton";
import { CSVManagerMode } from "@/types";
import { useCSVManager } from "@/hooks/useCSVManager";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export default function CSVManagerPage() {
    const {
        mode,
        selectedClient,
        file,
        data,
        isValid,
        isSubmitting,
        filters,
        searchTerm,
        currentPage,
        itemsPerPage,
        handleModeChange,
        handleClientSelect,
        handleFileSelect,
        handleValidationComplete,
        handleSubmitData,
        setFilters,
        handleSearch,
        handlePageChange,
        handleItemsPerPageChange,
        handleExportCSV,
    } = useCSVManager();

    // Function để tạo tên file có timestamp
    const getFormattedFileName = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        return `csv_export_${
            selectedClient?.accountId || ""
        }_${year}${month}${day}_${hours}${minutes}.csv`;
    };

    return (
        <div className="space-y-8">
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
                <div
                    className="mb-6
                    flex flex-col md:flex-row items-start justify-between gap-4"
                >
                    <ClientSelect
                        selectedClient={selectedClient}
                        onClientSelect={handleClientSelect}
                    />

                    {/* Download button */}
                    {mode === CSVManagerMode.DOWNLOAD && (
                        <div className="w-full md:w-auto flex md:justify-start order-2 md:order-1">
                            <DownloadButton
                                data={data}
                                filters={filters}
                                searchTerm={searchTerm}
                                filename={getFormattedFileName()}
                                disabled={data.length === 0}
                                handleExportCSV={handleExportCSV}
                            />
                        </div>
                    )}
                </div>

                {/* Upload Zone - chỉ hiển thị khi mode là UPLOAD */}
                {mode === CSVManagerMode.UPLOAD && (
                    <div className="mb-6">
                        <UploadZone
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
                                onValidationComplete={handleValidationComplete}
                                isSubmitting={isSubmitting}
                                onSubmit={handleSubmitData}
                            />
                        )}

                        {/* Hiển thị thông báo thành công khi đã submit dữ liệu trong chế độ Upload */}
                        {data.length > 0 && isValid && !file && (
                            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-start">
                                    <CheckCircleIcon className="h-6 w-6 text-green-500 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="text-green-800 font-medium">
                                            データが正常にアップロードされました！(Data
                                            successfully uploaded!)
                                        </h3>
                                        <p className="text-green-700 mt-2">
                                            合計{" "}
                                            <span className="font-medium">
                                                {data.length}
                                            </span>{" "}
                                            レコードがアップロードされました。
                                            (Total{" "}
                                            <span className="font-medium">
                                                {data.length}
                                            </span>{" "}
                                            records have been uploaded.)
                                        </p>
                                        <p className="text-green-600 mt-2 text-sm">
                                            新しいファイルをアップロードするには、上記の「アップロード」セクションを使用してください。
                                            (To upload a new file, use the
                                            upload section above.)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Display data table ONLY in Download mode */}
                {mode === CSVManagerMode.DOWNLOAD &&
                    data.length > 0 &&
                    isValid && (
                        <div className="space-y-4">
                            {/* Control Bar: Download button, Search và Filter */}
                            <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-4">
                                {/* Search and Filter */}
                                <div className="w-full md:flex-grow flex flex-col md:flex-row gap-2 md:gap-4 order-1 md:order-2">
                                    <SearchBar
                                        searchTerm={searchTerm}
                                        onSearch={handleSearch}
                                        placeholder="検索... (Search...)"
                                    />
                                    <FilterPanel
                                        filters={filters}
                                        onFilterChange={setFilters}
                                        columns={Object.keys(data[0]).filter(
                                            item => item !== "Action",
                                        )}
                                    />
                                </div>
                            </div>

                            {/* Data table */}
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
                                    onPageChange={handlePageChange}
                                    onItemsPerPageChange={
                                        handleItemsPerPageChange
                                    }
                                    maxPageButtons={5}
                                />
                            </div>
                        </div>
                    )}

                {/* Hiển thị thông báo khi không có dữ liệu ở chế độ Download */}
                {mode === CSVManagerMode.DOWNLOAD && data.length === 0 && (
                    <div className="p-8 text-center bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600">
                            ダウンロードするデータがありません。データをアップロードするには、アップロードモードに切り替えてください。
                            <br />
                            (No data available for download. Switch to Upload
                            mode to upload data.)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
