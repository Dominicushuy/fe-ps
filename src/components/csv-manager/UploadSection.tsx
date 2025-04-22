// src/components/csv-manager/UploadSection.tsx

import React from "react";
import UploadZone from "./UploadZone";
import CSVPreview from "./CSVPreview";
import { Client } from "@/types";

interface UploadSectionProps {
    file: File | null;
    selectedClient: Client | null;
    isSubmitting: boolean;
    onFileSelect: (file: File | null) => void;
    onValidationComplete: (isValid: boolean, data: any[]) => void;
    onSubmit: (isDuplicatable?: boolean) => void;
}

/**
 * Component for handling CSV uploads
 */
const UploadSection: React.FC<UploadSectionProps> = ({
    file,
    selectedClient,
    isSubmitting,
    onFileSelect,
    onValidationComplete,
    onSubmit,
}) => {
    return (
        <div className="space-y-6">
            {/* Upload Zone */}
            <UploadZone
                externalFile={file}
                onFileSelect={onFileSelect}
                disabled={!selectedClient}
            />

            {/* Display message if no client is selected */}
            {!selectedClient && (
                <p className="mt-2 text-sm text-amber-600">
                    ファイルをアップロードする前にクライアントを選択してください。
                    (Please select a client before uploading files.)
                </p>
            )}

            {/* CSV Preview - only shown when a file is selected */}
            {file && (
                <CSVPreview
                    file={file}
                    selectedClient={selectedClient}
                    onValidationComplete={onValidationComplete}
                    isSubmitting={isSubmitting}
                    onSubmit={onSubmit}
                />
            )}
        </div>
    );
};

export default UploadSection;
