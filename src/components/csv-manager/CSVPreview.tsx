"use client";

import React, { useState, useEffect } from "react";
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
    onSubmit?: () => void;
    onUploadComplete?: () => void;
}

export default function CSVPreview({
    file,
    selectedClient,
    onValidationComplete,
    isSubmitting = false,
    onSubmit,
}: CSVPreviewProps) {
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
                            message:
                                "必須列が見つかりません (Missing required columns)",
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
                                    message:
                                        "空のセルは許可されていません (Empty cell is not allowed)",
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
                            // Lấy 4 số đầu tiên từ CID
                            const firstFourDigits = cidValue.split("-")[0];
                            if (
                                firstFourDigits &&
                                firstFourDigits.length >= 4
                            ) {
                                // Thêm "00" vào đầu để tạo ID 6 chữ số
                                const extractedId = "00" + firstFourDigits;

                                // So sánh với ID của client đã chọn
                                if (extractedId !== selectedClient.id) {
                                    validationErrors.push({
                                        rowIndex,
                                        columnName: "CID",
                                        message: `CIDはクライアントIDと一致しません。期待される値: ${selectedClient.id.slice(
                                            2,
                                        )}-xxx-xxx (CID does not match client ID. Expected: ${selectedClient.id.slice(
                                            2,
                                        )}-xxx-xxx)`,
                                        value: cidValue,
                                    });
                                }
                            } else {
                                validationErrors.push({
                                    rowIndex,
                                    columnName: "CID",
                                    message:
                                        "CID形式が正しくありません。期待される形式: XXXX-XXX-XXX (Invalid CID format. Expected format: XXXX-XXX-XXX)",
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
                            message:
                                "CSVファイルの解析中にエラーが発生しました (Error parsing CSV file)",
                        },
                    ]);
                    setIsValid(false);
                    setIsValidating(false);
                    onValidationComplete(false, []);
                },
            });
        };

        validateCSV();
    }, [file, selectedClient, onValidationComplete]);

    // Xử lý việc submit với xác nhận ghi đè
    const handleSubmit = () => {
        if (onSubmit && isValid) {
            onSubmit();
            // Không cần clear file ở đây vì sẽ được clear từ hook useCSVManager
        }
    };

    // Hiển thị trạng thái đang validate
    if (isValidating) {
        return (
            <div className="my-6 p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex flex-col items-center">
                    <ArrowPathIcon className="w-10 h-10 text-blue-500 animate-spin mb-4" />
                    <p className="text-blue-600 font-medium">
                        CSVファイルを検証中... (Validating CSV file...)
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
                            CSVフォーマットエラー (CSV Format Error)
                        </h3>
                        <div className="mt-2 text-red-700">
                            <p>
                                次の必須列がCSVファイルに見つかりません (The
                                following required columns are missing in the
                                CSV file):
                            </p>
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
                                CSVファイルには次の列が必要です (Your CSV file
                                must include these columns):
                            </p>
                            <p className="mt-1 font-mono text-sm bg-red-100 p-2 rounded">
                                {requiredColumns.join(", ")}
                            </p>
                            <p className="mt-4">
                                正しい形式のCSVファイルをアップロードしてください。
                                (Please upload a CSV file with the correct
                                format.)
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
                                検証成功! CSVファイルは有効です。 (Validation
                                successful! CSV file is valid.)
                            </h3>
                        ) : (
                            <>
                                <h3 className="text-yellow-800 font-medium">
                                    検証警告: {errors.length}
                                    個のエラーが見つかりました。 (Validation
                                    warning: {errors.length} errors found.)
                                </h3>
                                <p className="text-yellow-700 mt-2">
                                    続行する前にすべてのエラーを修正してください。
                                    (Please fix all errors before proceeding.)
                                </p>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <h3 className="text-lg font-medium text-gray-800 mb-3">
                CSVプレビュー (CSV Preview)
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
                                                    Empty
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
                    プレビューは最初の5行のみを表示しています。全部で{" "}
                    {previewData.length} 行あります。 (Preview shows only first
                    5 rows. Total: {previewData.length} rows.)
                </p>
            )}

            {/* Error summary */}
            {!isValid && (
                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                    <h3 className="text-red-800 font-medium">
                        エラー概要 (Error Summary)
                    </h3>

                    {/* Client CID validation message */}
                    {selectedClient &&
                        errors.some(e => e.columnName === "CID") && (
                            <div className="mt-2 mb-4 p-3 bg-red-100 rounded-md border border-red-300">
                                <div className="flex items-start">
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-red-800">
                                            クライアントIDとCIDの不一致 (Client
                                            ID and CID mismatch)
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                            選択されたクライアント:{" "}
                                            {selectedClient.name} (ID:{" "}
                                            {selectedClient.id})
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                            CSVファイル内のCIDは、このクライアントのIDと一致する必要があります。CIDの最初の4桁が「
                                            {selectedClient.id.slice(2)}
                                            」で始まる必要があります。
                                        </p>
                                        <p className="text-xs text-red-700 mt-1">
                                            (CIDs in the CSV file must match
                                            this client&apos;s ID. The first 4
                                            digits of CID should start with
                                            &quot;
                                            {selectedClient.id.slice(2)}&quot;)
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
                                        行 (Row)
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-red-700"
                                    >
                                        列 (Column)
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-4 py-2 text-left text-xs font-medium text-red-700"
                                    >
                                        エラー (Error)
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
                                        パラメ重複チェック (Parame duplicated
                                        check)
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
                                            パラメ重複チェック確認 (Parame
                                            duplicated check)
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
                                    パラメータの重複をチェックします。同じパラメータが存在する場合は警告します。
                                    (Check for duplicate parameters. Will warn
                                    if the same parameter already exists.)
                                </p>
                                {confirmOverwrite && (
                                    <div className="mt-3 p-2 bg-amber-100 rounded border border-amber-300">
                                        <p className="text-sm text-amber-800 font-medium flex items-center">
                                            <CheckCircleIcon className="h-4 w-4 mr-1 text-amber-600" />
                                            重複チェック確認済み (Duplication
                                            check confirmed)
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
                                処理中... (Processing...)
                            </>
                        ) : (
                            "データを送信 (Submit Data)"
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
