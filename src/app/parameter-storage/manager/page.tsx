// src/app/parameter-storage/manager/page.tsx
"use client";

import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

    // Local state for download form and preview
    const [employeeId, setEmployeeId] = useState("");
    const [isDownloadSubmitting, setIsDownloadSubmitting] = useState(false);
    const [showPreview, setShowPreview] = useState(true);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    // Handler to clear filters
    const handleClearFilters = () => {
        setFilters([]);
    };

    // Handler to toggle preview visibility
    const handleTogglePreview = () => {
        setShowPreview(!showPreview);
    };

    // Handle download form submission
    const handleDownloadSubmit = () => {
        // Add validation for employee ID
        if (!employeeId.trim()) {
            alert("社員IDを入力してください (Please enter your employee ID)");
            return;
        }

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
                employeeId: employeeId,
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
                        employeeId={employeeId}
                        selectedAccounts={selectedAccounts}
                        selectedDataLayers={selectedDataLayers}
                        filters={filters}
                        data={data}
                        currentPage={currentPage}
                        itemsPerPage={itemsPerPage}
                        searchTerm={searchTerm}
                        showPreview={showPreview}
                        isSubmitting={isDownloadSubmitting}
                        downloadSuccess={downloadSuccess}
                        onEmployeeIdChange={setEmployeeId}
                        onAccountChange={handleAccountSelect}
                        onDataLayerChange={handleDataLayerSelect}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                        onTogglePreview={handleTogglePreview}
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
