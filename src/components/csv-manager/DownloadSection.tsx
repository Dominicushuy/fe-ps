// src/components/csv-manager/DownloadSection.tsx

import React from "react";
import DownloadForm from "./DownloadForm";
import DataPreviewSection from "./DataPreviewSection";
import { MediaAccount, DataLayer, ColumnFilter, CSVRow } from "@/types";

interface DownloadSectionProps {
    employeeId: string;
    selectedAccounts: MediaAccount[];
    selectedDataLayers: DataLayer[];
    filters: ColumnFilter[];
    data: CSVRow[];
    currentPage: number;
    itemsPerPage: number;
    searchTerm: string;
    showPreview: boolean;
    isSubmitting: boolean;
    downloadSuccess: boolean;
    onEmployeeIdChange: (id: string) => void;
    onAccountChange: (accounts: MediaAccount[]) => void;
    onDataLayerChange: (layers: DataLayer[]) => void;
    onFilterChange: (filters: ColumnFilter[]) => void;
    onClearFilters: () => void;
    onTogglePreview: () => void;
    onSubmit: () => void;
    onSearchChange: (term: string) => void;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

/**
 * Container component for the Download Mode UI
 */
const DownloadSection: React.FC<DownloadSectionProps> = ({
    employeeId,
    selectedAccounts,
    selectedDataLayers,
    filters,
    data,
    currentPage,
    itemsPerPage,
    searchTerm,
    showPreview,
    isSubmitting,
    downloadSuccess,
    onEmployeeIdChange,
    onAccountChange,
    onDataLayerChange,
    onFilterChange,
    onClearFilters,
    onTogglePreview,
    onSubmit,
    onSearchChange,
    onPageChange,
    onItemsPerPageChange,
}) => {
    return (
        <div className="space-y-6">
            {/* Download Form */}
            <DownloadForm
                employeeId={employeeId}
                selectedAccounts={selectedAccounts}
                selectedDataLayers={selectedDataLayers}
                filters={filters}
                isSubmitting={isSubmitting}
                downloadSuccess={downloadSuccess}
                showPreview={showPreview}
                onEmployeeIdChange={onEmployeeIdChange}
                onAccountChange={onAccountChange}
                onDataLayerChange={onDataLayerChange}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                onTogglePreview={onTogglePreview}
                onSubmit={onSubmit}
            />

            {/* Data Preview */}
            <DataPreviewSection
                showPreview={showPreview}
                data={data}
                currentPage={currentPage}
                itemsPerPage={itemsPerPage}
                filters={filters}
                searchTerm={searchTerm}
                onSearchChange={onSearchChange}
                onPageChange={onPageChange}
                onItemsPerPageChange={onItemsPerPageChange}
                onTogglePreview={onTogglePreview}
            />
        </div>
    );
};

export default DownloadSection;
