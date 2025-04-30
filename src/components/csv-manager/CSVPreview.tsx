import React, { useState, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Client, CSVRow, ValidationError } from "@/types";
import { Switch } from "@headlessui/react";
import {
    CheckCircleIcon,
    XCircleIcon,
    ExclamationTriangleIcon,
    ArrowPathIcon,
    ExclamationCircleIcon,
} from "@heroicons/react/24/outline";
import Papa from "papaparse";

interface CSVPreviewProps {
    file: File | null;
    selectedClient: Client | null;
    onValidationComplete: (isValid: boolean, data: CSVRow[]) => void;
    isSubmitting?: boolean;
    onSubmit?: (isDuplicatable?: boolean) => void;
    onUploadComplete?: () => void;
}

export default function CSVPreview({
    file,
    selectedClient,
    onValidationComplete,
    isSubmitting = false,
    onSubmit,
}: CSVPreviewProps) {
    const t = useTranslations();
    const [isValidating, setIsValidating] = useState(false);
    const [previewData, setPreviewData] = useState<CSVRow[]>([]);
    const [errors, setErrors] = useState<ValidationError[]>([]);
    const [isValid, setIsValid] = useState(false);
    const [hasColumnError, setHasColumnError] = useState(false);
    const [confirmOverwrite, setConfirmOverwrite] = useState(false);

    // Tất cả các cột được yêu cầu trong file CSV (để kiểm tra header)
    const requiredColumns = [
        "Action",
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

    // Chỉ những cột có giá trị bắt buộc mới cần kiểm tra ô trống
    const requiredCellColumns = [
        "Action",
        "媒体ID",
        "CID",
        "アカウントID",
        "キャンペーンID",
        "キャンペーン名",
        "パラメ発行済みURL",
    ];

    // Parse và validate file CSV
    useEffect(() => {
        if (!file) {
            setPreviewData([]);
            setErrors([]);
            setIsValid(false);
            setHasColumnError(false);
            return;
        }

        const validateCSV = async () => {
            setIsValidating(true);

            // Parse file CSV
            Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: results => {
                    const parsedData = results.data as CSVRow[];
                    const validationErrors: ValidationError[] = [];
                    let hasColumnIssue = false;

                    // Kiểm tra xem có đầy đủ các cột yêu cầu không
                    const headers = Object.keys(parsedData[0] || {});
                    const missingColumns = requiredColumns.filter(
                        col => !headers.includes(col),
                    );

                    if (missingColumns.length > 0) {
                        hasColumnIssue = true;
                        validationErrors.push({
                            rowIndex: -1,
                            columnName: missingColumns.join(", "),
                            message: t("missingRequiredColumns"),
                        });
                    }

                    // Kiểm tra các ô trống CHỈ trên các cột bắt buộc
                    parsedData.forEach((row, rowIndex) => {
                        requiredCellColumns.forEach(col => {
                            if (
                                headers.includes(col) &&
                                (!row[col] || row[col] === "")
                            ) {
                                validationErrors.push({
                                    rowIndex,
                                    columnName: col,
                                    message: t("emptyCellNotAllowed"),
                                    value: row[col],
                                });
                            }
                        });

                        // Kiểm tra CID có khớp với Client ID đã chọn không
                        if (
                            selectedClient &&
                            headers.includes("CID") &&
                            row["CID"]
                        ) {
                            const cidValue = row["CID"];
                            // Lấy phần đầu tiên của CID (trước dấu -)
                            const firstChunk = cidValue.split("-")[0];

                            if (firstChunk) {
                                // Compare directly with the client ID, without any assumptions about format
                                if (firstChunk === selectedClient.id) {
                                    // CID matches client ID - no error
                                } else {
                                    validationErrors.push({
                                        rowIndex,
                                        columnName: "CID",
                                        message: t("cidDoesNotMatchClientId", {
                                            clientId: selectedClient.id,
                                        }),
                                        value: cidValue,
                                    });
                                }
                            } else {
                                validationErrors.push({
                                    rowIndex,
                                    columnName: "CID",
                                    message: t("invalidCidFormat", {
                                        clientId: selectedClient.id,
                                    }),
                                    value: cidValue,
                                });
                            }
                        }
                    });

                    const isDataValid = validationErrors.length === 0;

                    // Lưu kết quả
                    setPreviewData(parsedData);
                    setErrors(validationErrors);
                    setIsValid(isDataValid);
                    setHasColumnError(hasColumnIssue);
                    setIsValidating(false);

                    // Callback để thông báo kết quả validation
                    onValidationComplete(isDataValid, parsedData);
                },
                error: error => {
                    console.error("Error parsing CSV:", error);
                    setErrors([
                        {
                            rowIndex: -1,
                            columnName: "",
                            message: t("errorParsingCsvFile"),
                        },
                    ]);
                    setIsValid(false);
                    setIsValidating(false);
                    onValidationComplete(false, []);
                },
            });
        };

        validateCSV();
    }, [file, selectedClient, onValidationComplete, t]);

    // Xử lý việc submit với xác nhận ghi đè
    const handleSubmit = useCallback(() => {
        if (onSubmit && isValid) {
            // Pass the confirmOverwrite flag to the onSubmit function
            onSubmit(confirmOverwrite);
        }
    }, [onSubmit, isValid, confirmOverwrite]);

    // Hiển thị trạng thái đang validate
    if (isValidating) {
        return (
            <div className="my-6 p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex flex-col items-center">
                    <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-blue-600 font-medium">
                        {t("validatingCsvFile")}
                    </p>
                </div>
            </div>
        );
    }

    // Nếu không có dữ liệu hoặc file, không hiển thị gì cả
    if (!file || previewData.length === 0) {
        return null;
    }

    // Lấy headers từ dữ liệu
    const headers = Object.keys(previewData[0] || {});

    // Nếu lỗi cột, hiển thị thông báo lỗi và không hiển thị bảng
    if (hasColumnError) {
        return (
            <div className="my-6 p-6 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-start">
                    <XCircleIcon className="w-6 h-6 text-red-500 mr-3 flex-shrink-0" />
                    <div>
                        <h3 className="text-red-800 font-medium text-lg">
                            {t("csvFormatError")}
                        </h3>
                        <div className="mt-2 text-red-700">
                            <p>{t("missingRequiredColumnsInFile")}:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                {errors
                                    .filter(err => err.rowIndex === -1)
                                    .map((err, index) => (
                                        <li key={index} className="ml-4">
                                            {err.columnName}
                                        </li>
                                    ))}
                            </ul>
                            <p className="mt-4">
                                {t("csvFileMustIncludeColumns")}:
                            </p>
                            <p className="mt-1 font-mono text-sm bg-red-100 p-2 rounded">
                                {requiredColumns.join(", ")}
                            </p>
                            <p className="mt-4">
                                {t("pleaseUploadCorrectFormatCsv")}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Hiển thị dữ liệu với highlight các ô lỗi
    return (
        <div className="my-6">
            <div
                className={`p-4 rounded-lg mb-4 ${
                    isValid
                        ? "bg-green-50 border border-green-200"
                        : "bg-yellow-50 border border-yellow-200"
                }`}
            >
                <div className="flex items-start">
                    {isValid ? (
                        <CheckCircleIcon className="w-6 h-6 text-green-500 mr-3 flex-shrink-0" />
                    ) : (
                        <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500 mr-3 flex-shrink-0" />
                    )}
                    <div>
                        {isValid ? (
                            <h3 className="text-green-800 font-medium">
                                {t("uploadValidationSuccess")}
                            </h3>
                        ) : (
                            <>
                                <h3 className="text-yellow-800 font-medium">
                                    {t("uploadValidationWarning", {
                                        "0": errors.length.toString(),
                                    })}
                                </h3>
                                <p className="text-yellow-700 mt-2">
                                    {t("fixAllErrorsBeforeProceeding")}
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-3">
                {t("csvPreview")}
            </h3>

            <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                            >
                                Row
                            </th>
                            {headers.map(header => (
                                <th
                                    key={header}
                                    scope="col"
                                    className={`px-4 py-3 text-left text-xs font-medium ${
                                        requiredColumns.includes(header)
                                            ? "text-blue-600"
                                            : "text-gray-500"
                                    } uppercase tracking-wider whitespace-nowrap`}
                                >
                                    {header}
                                    {requiredColumns.includes(header) && " *"}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {/* Render the first 5 rows only for preview */}
                        {previewData.slice(0, 5).map((row, rowIndex) => (
                            <tr
                                key={rowIndex}
                                className={
                                    rowIndex % 2 === 0
                                        ? "bg-white"
                                        : "bg-gray-50"
                                }
                            >
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">
                                    {rowIndex + 1}
                                </td>
                                {headers.map(header => {
                                    // Check if this cell has an error
                                    const cellError = errors.find(
                                        err =>
                                            err.rowIndex === rowIndex &&
                                            err.columnName === header,
                                    );

                                    return (
                                        <td
                                            key={`${rowIndex}-${header}`}
                                            className={`px-4 py-2 whitespace-nowrap text-sm ${
                                                cellError
                                                    ? "bg-red-100 text-red-900"
                                                    : "text-gray-900"
                                            }`}
                                        >
                                            {row[header] || (
                                                <span className="text-red-500 italic">
                                                    {t("emptyCell")}
                                                </span>
                                            )}
                                            {cellError && (
                                                <div className="text-xs text-red-600 mt-1">
                                                    {cellError.message}
                                                </div>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Show preview indication if data has more than 5 rows */}
            {previewData.length > 5 && (
                <p className="text-sm text-gray-500 mt-2">
                    {t("previewShowsFirstRows", {
                        "0": "5",
                        "1": previewData.length.toString(),
                    })}
                </p>
            )}

            {/* Error summary */}
            {!isValid && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="text-red-800 font-medium">
                        {t("errorSummary")}
                    </h3>

                    {/* Client CID validation message */}
                    {selectedClient &&
                        errors.some(e => e.columnName === "CID") && (
                            <div className="mt-2 mb-4 p-3 bg-red-100 rounded-md border border-red-300">
                                <div className="flex items-start">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">
                                            {t("clientIdAndCidMismatch")}
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                            {t("selectedClient")}:{" "}
                                            {selectedClient.name} (ID:{" "}
                                            {selectedClient.id})
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                            {t("cidMustMatchClientId", {
                                                clientId: selectedClient.id,
                                            })}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    <div className="mt-3 max-h-60 overflow-y-auto">
                        <table className="min-w-full divide-y divide-red-200">
                            <thead className="bg-red-100">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-red-700"
                                    >
                                        {t("row")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-red-700"
                                    >
                                        {t("column")}
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-red-700"
                                    >
                                        {t("error")}
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-red-50 divide-y divide-red-200">
                                {errors.map((error, index) => (
                                    <tr
                                        key={index}
                                        className={
                                            error.columnName === "CID"
                                                ? "bg-red-100"
                                                : ""
                                        }
                                    >
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-red-700">
                                            {error.rowIndex >= 0
                                                ? error.rowIndex + 1
                                                : "N/A"}
                                        </td>
                                        <td className="px-4 py-2 whitespace-nowrap text-sm text-red-700">
                                            {error.columnName}
                                        </td>
                                        <td className="px-4 py-2 text-sm text-red-700">
                                            {error.message}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Submit section with overwrite checkbox */}
            <div className="mt-6">
                {/* Overwrite confirmation with Switch */}
                <div className="mb-4">
                    <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-lg shadow-sm">
                        <div className="flex items-start">
                            <ExclamationCircleIcon className="h-6 w-6 text-amber-600 mr-3 flex-shrink-0 mt-1" />
                            <div className="flex-grow">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-amber-800 font-medium">
                                        {t("parameDuplicatedCheck")}
                                    </h4>
                                    <Switch
                                        checked={confirmOverwrite}
                                        onChange={setConfirmOverwrite}
                                        className={`${
                                            confirmOverwrite
                                                ? "bg-primary-600"
                                                : "bg-gray-300"
                                        } relative inline-flex h-6 w-12 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
                                    >
                                        <span className="sr-only">
                                            {t("parameDuplicatedCheck")}
                                        </span>
                                        <span
                                            className={`${
                                                confirmOverwrite
                                                    ? "translate-x-6"
                                                    : "translate-x-1"
                                            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                        />
                                    </Switch>
                                </div>
                                <p className="text-sm text-amber-700 mt-2">
                                    {t("checkForDuplicateParameters")}
                                </p>
                                {confirmOverwrite && (
                                    <div className="mt-3 p-2 bg-amber-100 rounded border border-amber-300">
                                        <p className="text-sm text-amber-800 font-medium flex items-center">
                                            <CheckCircleIcon className="h-4 w-4 mr-1 text-amber-600" />
                                            {t("duplicationCheckConfirmed")}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit button */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                        ${
                            isValid
                                ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                                : "bg-gray-400 cursor-not-allowed"
                        } focus:outline-none focus:ring-2 focus:ring-offset-2`}
                        disabled={!isValid || isSubmitting}
                        onClick={handleSubmit}
                    >
                        {isSubmitting ? (
                            <>
                                <ArrowPathIcon className="w-5 h-5 mr-2 animate-spin" />
                                {t("processing")}
                            </>
                        ) : (
                            t("submitData")
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
