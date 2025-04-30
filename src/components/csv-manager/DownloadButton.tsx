"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import {
    ArrowDownTrayIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { CSVRow, ColumnFilter } from "@/types";
import { downloadCSV } from "@/lib/utils/csv-export";
import { applyFilters } from "@/lib/utils/filter-utils";

// Các trạng thái của quá trình export
enum ExportStatus {
    IDLE = "idle",
    EXPORTING = "exporting",
    SUCCESS = "success",
    ERROR = "error",
}

interface DownloadButtonProps {
    data: CSVRow[];
    filters: ColumnFilter[];
    searchTerm: string;
    filename?: string;
    disabled?: boolean;
    handleExportCSV?: (filename?: string) => void;
}

export default function DownloadButton({
    data,
    filters,
    searchTerm,
    filename,
    disabled = false,
    handleExportCSV,
}: DownloadButtonProps) {
    const t = useTranslations();
    const [exportStatus, setExportStatus] = useState<ExportStatus>(
        ExportStatus.IDLE,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Xử lý export CSV
    const handleExport = async () => {
        if (disabled || exportStatus === ExportStatus.EXPORTING) return;

        try {
            setExportStatus(ExportStatus.EXPORTING);

            // Giả lập quá trình xử lý (có thể bỏ trong môi trường thực tế)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Sử dụng handleExportCSV từ hook nếu có, nếu không dùng phương thức local
            if (handleExportCSV) {
                handleExportCSV(filename);
            } else {
                downloadCSV(data, filters, searchTerm, filename);
            }

            setExportStatus(ExportStatus.SUCCESS);

            // Tự động reset trạng thái sau 3 giây
            setTimeout(() => {
                setExportStatus(ExportStatus.IDLE);
            }, 3000);
        } catch (error) {
            console.error("Error exporting CSV:", error);
            setExportStatus(ExportStatus.ERROR);
            setErrorMessage(
                error instanceof Error ? error.message : t("errorDuringExport"),
            );

            // Tự động reset trạng thái lỗi sau 5 giây
            setTimeout(() => {
                setExportStatus(ExportStatus.IDLE);
                setErrorMessage("");
            }, 5000);
        }
    };

    // Render button dựa trên trạng thái
    const renderButton = () => {
        switch (exportStatus) {
            case ExportStatus.EXPORTING:
                return (
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 cursor-not-allowed opacity-80"
                        disabled
                    >
                        <ArrowPathIcon
                            className="mr-2 -ml-1 h-5 w-5 animate-spin"
                            aria-hidden="true"
                        />
                        {t("exporting")}
                    </button>
                );

            case ExportStatus.SUCCESS:
                return (
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors"
                        onClick={handleExport}
                    >
                        <CheckCircleIcon
                            className="mr-2 -ml-1 h-5 w-5"
                            aria-hidden="true"
                        />
                        {t("exportCompleted")}
                    </button>
                );

            case ExportStatus.ERROR:
                return (
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors"
                        onClick={handleExport}
                    >
                        <XCircleIcon
                            className="mr-2 -ml-1 h-5 w-5"
                            aria-hidden="true"
                        />
                        {t("retry")}
                    </button>
                );

            default: // IDLE
                return (
                    <button
                        type="button"
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
              ${
                  disabled
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary-800 hover:bg-primary-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-700"
              } transition-colors`}
                        onClick={handleExport}
                        disabled={disabled}
                    >
                        <ArrowDownTrayIcon
                            className="mr-2 -ml-1 h-5 w-5"
                            aria-hidden="true"
                        />
                        {t("exportCsv")}
                    </button>
                );
        }
    };

    const filteredDataCount = applyFilters(data, filters, searchTerm).length;

    return (
        <div>
            {renderButton()}

            {/* Hiển thị thông báo lỗi nếu có */}
            {exportStatus === ExportStatus.ERROR && errorMessage && (
                <div className="mt-2 text-sm text-red-600">{errorMessage}</div>
            )}

            {/* Thông tin về dữ liệu được xuất */}
            {exportStatus === ExportStatus.SUCCESS && (
                <div className="mt-2 text-sm text-green-600">
                    {filters.length > 0 || searchTerm
                        ? t("filteredRecordsExported", {
                              "0": filteredDataCount.toString(),
                          })
                        : t("recordsExported", {
                              "0": data.length.toString(),
                          })}
                </div>
            )}
        </div>
    );
}
