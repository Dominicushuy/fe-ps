// src/app/parameter-storage/manager/page.tsx

"use client";

import React from "react";
import ModeToggle from "@/components/csv-manager/ModeToggle";
import ClientSelect from "@/components/csv-manager/ClientSelect";
import ConfirmClientChangeDialog from "@/components/csv-manager/ConfirmClientChangeDialog";
import NavigationConfirmDialog from "@/components/csv-manager/NavigationConfirmDialog";
import { CSVManagerMode } from "@/types";
import { useCSVManager } from "@/hooks/useCSVManager";
import UploadSection from "@/components/csv-manager/UploadSection";
import DownloadSection from "@/components/csv-manager/DownloadSection";

export default function CSVManagerPage() {
    const {
        mode,
        selectedClient,
        clientId,
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
        // New state from the hook
        employeeId,
        isDownloadSubmitting,
        downloadSuccess,

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
        // New handler from the hook
        handleDownloadSubmit,
        // New setter from the hook
        setEmployeeId,
    } = useCSVManager();

    // Handler to clear filters
    const handleClearFilters = () => {
        setFilters([]);
    };

    return (
        <div className="space-y-8">
            {/* Toast Container */}

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
                    <UploadSection
                        file={file}
                        selectedClient={selectedClient}
                        isSubmitting={isSubmitting}
                        onFileSelect={handleFileSelect}
                        onValidationComplete={handleValidationComplete}
                        onSubmit={handleSubmitData}
                    />
                )}

                {/* DOWNLOAD MODE */}
                {mode === CSVManagerMode.DOWNLOAD && (
                    <DownloadSection
                        clientId={clientId}
                        employeeId={employeeId}
                        selectedAccounts={selectedAccounts}
                        selectedDataLayers={selectedDataLayers}
                        filters={filters}
                        data={data}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        searchTerm={searchTerm}
                        isSubmitting={isDownloadSubmitting}
                        downloadSuccess={downloadSuccess}
                        onEmployeeIdChange={setEmployeeId}
                        onAccountChange={handleAccountSelect}
                        onDataLayerChange={handleDataLayerSelect}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onSubmit={handleDownloadSubmit}
                        onSearchChange={handleSearch}
                        onPageChange={handlePageChange}
                        onItemsPerPageChange={handleItemsPerPageChange}
                    />
                )}
            </div>
        </div>
    );
}
