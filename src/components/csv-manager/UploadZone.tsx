"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import {
    DocumentArrowUpIcon,
    CheckCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    DocumentTextIcon,
} from "@heroicons/react/24/outline";

// Kích thước tối đa: 100MB
const MAX_FILE_SIZE = 100 * 1024 * 1024;

// Các trạng thái upload
enum UploadStatus {
    IDLE = "idle",
    VALIDATING = "validating",
    UPLOADING = "uploading",
    SUCCESS = "success",
    ERROR = "error",
}

interface UploadZoneProps {
    onFileSelect: (file: File | null) => void;
    disabled?: boolean;
}

export default function UploadZone({
    onFileSelect,
    disabled = false,
}: UploadZoneProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploadStatus, setUploadStatus] = useState<UploadStatus>(
        UploadStatus.IDLE,
    );
    const [errorMessage, setErrorMessage] = useState<string>("");

    // Xử lý việc drop file
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            setErrorMessage("");

            if (acceptedFiles.length === 0) {
                return;
            }

            const selectedFile = acceptedFiles[0];

            // Kiểm tra định dạng file
            if (!selectedFile.name.endsWith(".csv")) {
                setErrorMessage(
                    "CSVファイルのみアップロードできます。(Only CSV files are allowed.)",
                );
                return;
            }

            // Kiểm tra kích thước file
            if (selectedFile.size > MAX_FILE_SIZE) {
                setErrorMessage(
                    "ファイルサイズは100MBを超えることはできません。(File size cannot exceed 100MB.)",
                );
                return;
            }

            // Giả lập quá trình upload
            setFile(selectedFile);
            setUploadStatus(UploadStatus.VALIDATING);

            // Simulating validation process
            setTimeout(() => {
                setUploadStatus(UploadStatus.UPLOADING);

                // Simulating upload process
                setTimeout(() => {
                    setUploadStatus(UploadStatus.SUCCESS);
                    onFileSelect(selectedFile);
                }, 1500);
            }, 800);
        },
        [onFileSelect],
    );

    // Reset component khi disabled thay đổi
    useEffect(() => {
        if (disabled) {
            setFile(null);
            setUploadStatus(UploadStatus.IDLE);
            setErrorMessage("");
        }
    }, [disabled]);

    // Xóa file đã chọn
    const handleClearFile = () => {
        setFile(null);
        setUploadStatus(UploadStatus.IDLE);
        setErrorMessage("");
        onFileSelect(null);
    };

    // Cấu hình dropzone
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        onDrop,
        accept: {
            "text/csv": [".csv"],
        },
        disabled:
            disabled ||
            uploadStatus === UploadStatus.UPLOADING ||
            uploadStatus === UploadStatus.VALIDATING,
        maxSize: MAX_FILE_SIZE,
        multiple: false,
    });

    // Xác định class cho dropzone dựa trên trạng thái
    const dropzoneClassName = `
    w-full rounded-lg border-2 border-dashed p-8 transition-all duration-300
    ${isDragActive && !isDragReject ? "border-primary-400 bg-primary-50" : ""}
    ${isDragAccept ? "border-green-400 bg-green-50" : ""}
    ${isDragReject || errorMessage ? "border-red-400 bg-red-50" : ""}
    ${!isDragActive && !errorMessage && uploadStatus === UploadStatus.IDLE ? "border-gray-300 hover:border-primary-400 hover:bg-primary-50" : ""}
    ${uploadStatus === UploadStatus.SUCCESS ? "border-green-400 bg-green-50" : ""}
    ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
  `;

    // Hiển thị nội dung dựa trên trạng thái
    const renderDropzoneContent = () => {
        if (
            file &&
            (uploadStatus === UploadStatus.SUCCESS ||
                uploadStatus === UploadStatus.UPLOADING ||
                uploadStatus === UploadStatus.VALIDATING)
        ) {
            return (
                <div className="flex flex-col items-center">
                    {uploadStatus === UploadStatus.VALIDATING && (
                        <>
                            <ArrowPathIcon className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-sm text-primary-800 font-medium">
                                ファイルを検証中... (Validating file...)
                            </p>
                        </>
                    )}

                    {uploadStatus === UploadStatus.UPLOADING && (
                        <>
                            <ArrowPathIcon className="w-12 h-12 text-primary-600 animate-spin mb-4" />
                            <p className="text-sm text-primary-800 font-medium">
                                アップロード中... (Uploading...)
                            </p>
                        </>
                    )}

                    {uploadStatus === UploadStatus.SUCCESS && (
                        <>
                            <CheckCircleIcon className="w-12 h-12 text-green-500 mb-4" />
                            <p className="text-sm text-green-600 font-medium">
                                アップロード成功! (Upload successful!)
                            </p>
                        </>
                    )}

                    <div className="mt-4 flex items-center bg-white rounded-md p-2 border border-gray-200 max-w-full">
                        <DocumentTextIcon className="w-5 h-5 text-gray-500 mr-2 flex-shrink-0" />
                        <span className="text-sm truncate max-w-xs">
                            {file.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-2">
                            ({formatFileSize(file.size)})
                        </span>
                    </div>

                    {uploadStatus === UploadStatus.SUCCESS && (
                        <button
                            type="button"
                            onClick={handleClearFile}
                            className="mt-4 text-sm text-red-500 hover:text-red-700 focus:outline-none transition-colors"
                        >
                            クリア (Clear)
                        </button>
                    )}
                </div>
            );
        }

        if (errorMessage) {
            return (
                <div className="flex flex-col items-center">
                    <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mb-4" />
                    <p className="text-sm text-red-500 font-medium">
                        {errorMessage}
                    </p>
                    <button
                        type="button"
                        onClick={() => setErrorMessage("")}
                        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none transition-colors"
                    >
                        再試行 (Try Again)
                    </button>
                </div>
            );
        }

        return (
            <div className="flex flex-col items-center">
                <DocumentArrowUpIcon className="w-12 h-12 text-primary-400 mb-4" />
                <p className="text-sm text-gray-500 font-medium">
                    ここにCSVファイルをドラッグ＆ドロップするか
                </p>
                <p className="text-sm text-gray-500">
                    ファイルを選択してください。(Drag & drop a CSV file here or
                    click to select)
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    最大サイズ: 100MB、形式: .csv のみ (Max size: 100MB, Format:
                    .csv only)
                </p>
            </div>
        );
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                CSVファイルをアップロード (Upload CSV File)
            </label>

            <div {...getRootProps()} className={dropzoneClassName}>
                <input {...getInputProps()} />
                {renderDropzoneContent()}
            </div>

            {file && uploadStatus === UploadStatus.SUCCESS && (
                <div className="mt-2 p-3 bg-green-50 rounded-md border border-green-100 flex items-start">
                    <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-700">
                            ファイルがアップロードされました (File uploaded)
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                            ファイル名: {file.name} | サイズ:{" "}
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
