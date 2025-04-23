// src/components/csv-manager/DownloadSection.tsx

import React from "react";
import DownloadForm from "./DownloadForm";
import { MediaAccount, DataLayer, ColumnFilter, CSVRow } from "@/types";

interface DownloadSectionProps {
    clientId: string | null;
    employeeId: string;
    selectedAccounts: MediaAccount[];
    selectedDataLayers: DataLayer[];
    filters: ColumnFilter[];
    data: CSVRow[];
    currentPage: number;
    itemsPerPage: number;
    searchTerm: string;
    isSubmitting: boolean;
    downloadSuccess: boolean;
    onEmployeeIdChange: (id: string) => void;
    onAccountChange: (accounts: MediaAccount[]) => void;
    onDataLayerChange: (layers: DataLayer[]) => void;
    onFilterChange: (filters: ColumnFilter[]) => void;
    onClearFilters: () => void;
    onSubmit: () => void;
    onSearchChange: (term: string) => void;
    onPageChange: (page: number) => void;
    onItemsPerPageChange: (itemsPerPage: number) => void;
}

/**
 * Container component for the Download Mode UI
 */
const DownloadSection: React.FC<DownloadSectionProps> = ({
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
    return (
        <div className="space-y-6">
            {/* Download Form */}
            <DownloadForm
                clientId={clientId}
                employeeId={employeeId}
                selectedAccounts={selectedAccounts}
                selectedDataLayers={selectedDataLayers}
                filters={filters}
                isSubmitting={isSubmitting}
                downloadSuccess={downloadSuccess}
                onEmployeeIdChange={onEmployeeIdChange}
                onAccountChange={onAccountChange}
                onDataLayerChange={onDataLayerChange}
                onFilterChange={onFilterChange}
                onClearFilters={onClearFilters}
                onSubmit={onSubmit}
            />
        </div>
    );
};

export default DownloadSection;
