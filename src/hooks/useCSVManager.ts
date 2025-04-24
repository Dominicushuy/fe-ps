// src/hooks/useCSVManager.ts

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    CSVManagerMode,
    CSVRow,
    Client,
    MediaAccount,
    DataLayer,
    ValidationError,
    ColumnFilter,
} from "@/types";
import { downloadCSV } from "@/lib/utils/csv-export";
import { uploadCSVFile, UploadCSVResponse } from "@/lib/api/upload";
import { createDownloadProcess } from "@/lib/api/param-storage";

export function useCSVManager() {
    const router = useRouter();
    const [mode, setMode] = useState<CSVManagerMode>(CSVManagerMode.UPLOAD);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const [data, setData] = useState<CSVRow[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationError[]>(
        [],
    );
    const [isValid, setIsValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [filters, setFilters] = useState<ColumnFilter[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Add state for download form
    const [employeeId, setEmployeeId] = useState("");
    const [isDownloadSubmitting, setIsDownloadSubmitting] = useState(false);
    const [downloadSuccess, setDownloadSuccess] = useState(false);

    // New states for account, and data layer filters
    // Removed selectedMedia state
    const [selectedAccounts, setSelectedAccounts] = useState<MediaAccount[]>(
        [],
    );

    // Initialize with NO data layers selected (changed from ALL_DATA_LAYERS)
    const [selectedDataLayers, setSelectedDataLayers] = useState<DataLayer[]>(
        [],
    );

    // Track the last upload response
    const [lastUploadResponse, setLastUploadResponse] =
        useState<UploadCSVResponse | null>(null);

    // Thêm state cho dialog xác nhận thay đổi client
    const [showClientChangeConfirm, setShowClientChangeConfirm] =
        useState(false);
    const [pendingClientChange, setPendingClientChange] =
        useState<Client | null>(null);

    // Thêm state cho navigation confirm dialog
    const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);

    // Clear selected accounts when client changes
    useEffect(() => {
        // When client changes, reset selected accounts
        setSelectedAccounts([]);
    }, [selectedClient?.id]);

    // Handler for account selection
    const handleAccountSelect = useCallback((accounts: MediaAccount[]) => {
        setSelectedAccounts(accounts);
    }, []);

    // Handler for data layer selection
    const handleDataLayerSelect = useCallback((layers: DataLayer[]) => {
        setSelectedDataLayers(layers);
    }, []);

    // Các hàm xử lý mới
    // Handler cho việc thay đổi trang
    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    // Handler cho việc thay đổi số lượng mục trên mỗi trang
    const handleItemsPerPageChange = useCallback((items: number) => {
        setItemsPerPage(items);
        // Reset trang về 1 khi thay đổi số lượng mục
        setCurrentPage(1);
    }, []);

    // Handler cho việc tìm kiếm
    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term);
        // Reset trang về 1 khi thay đổi giá trị tìm kiếm
        setCurrentPage(1);
    }, []);

    // Các hàm xử lý khác giữ nguyên như trước
    const handleModeChange = useCallback((newMode: CSVManagerMode) => {
        setMode(newMode);
        // Reset state khi chuyển mode
        setFile(null);
        setData([]);
        setValidationErrors([]);
        setIsValid(false);
        setFilters([]);
        setSearchTerm("");
        setCurrentPage(1);

        // Clear account selection and data layers
        setSelectedAccounts([]);
        setSelectedDataLayers([]); // Reset to empty array
    }, []);

    const handleClientSelect = useCallback(
        (client: Client | null) => {
            // Nếu đã upload file CSV và đang ở chế độ UPLOAD, hiển thị cảnh báo
            if (mode === CSVManagerMode.UPLOAD && file && data.length > 0) {
                setPendingClientChange(client);
                setShowClientChangeConfirm(true);
            } else {
                // Nếu không có file hoặc data, thay đổi client ngay lập tức
                setSelectedClient(client);
            }
        },
        [file, data.length, mode],
    );

    const handleFileSelect = useCallback((selectedFile: File | null) => {
        setFile(selectedFile);
        if (!selectedFile) {
            setData([]);
            setValidationErrors([]);
            setIsValid(false);
        }
    }, []);

    // Hàm xử lý filter mới
    const handleFilterChange = useCallback((newFilters: ColumnFilter[]) => {
        setFilters(newFilters);
        // Reset trang về 1 khi thay đổi filter
        setCurrentPage(1);
    }, []);

    const handleValidationComplete = useCallback(
        (valid: boolean, validatedData: CSVRow[]) => {
            setIsValid(valid);

            // Nếu dữ liệu hợp lệ, lưu vào state
            if (valid) {
                setData(validatedData);
            }
        },
        [],
    );

    // Updated handleSubmitData to handle the API response
    const handleSubmitData = useCallback(
        async (isDuplicatable = false) => {
            if (!isValid || !file || !selectedClient) return;

            setIsSubmitting(true);

            try {
                // Use the imported API function
                const response = await uploadCSVFile(
                    file,
                    selectedClient.id,
                    isDuplicatable,
                );

                // Store the response for later reference
                setLastUploadResponse(response);

                if (response) {
                    setFile(null);
                    setData([]);
                    setValidationErrors([]);
                    setIsValid(false);

                    // Show success toast
                    toast.success(
                        `データが正常にアップロードされました！(Data successfully uploaded! ID: ${response.id})`,
                    );

                    // Show navigation confirmation dialog
                    setShowNavigationConfirm(true);
                }
            } catch (error) {
                console.error("Error uploading CSV file:", error);

                // Handle different types of errors
                let errorMessage =
                    "エラーが発生しました。後でもう一度お試しください。(An error occurred. Please try again later.)";

                if (error instanceof Response) {
                    if (error.status === 400) {
                        errorMessage =
                            "リクエストが無効です。ファイルを確認してください。(Invalid request. Please check the file.)";
                    } else if (error.status === 401) {
                        errorMessage =
                            "認証が必要です。再度ログインしてください。(Authentication required. Please log in again.)";
                    }
                } else if (error instanceof Error) {
                    errorMessage = `${error.message}`;
                }

                // Show error toast
                toast.error(errorMessage);
            } finally {
                setIsSubmitting(false);
            }
        },
        [isValid, file, selectedClient],
    );
    // Move the download submit handler to the hook
    const handleDownloadSubmit = useCallback(async () => {
        if (selectedAccounts.length === 0) {
            toast.error(
                "アカウントを選択してください (Please select accounts)",
            );
            return;
        }

        if (selectedDataLayers.length === 0) {
            toast.error(
                "データ層を選択してください (Please select data layers)",
            );
            return;
        }

        // Get the download level (first selected data layer)
        const downloadLevel =
            selectedDataLayers.length > 0 ? selectedDataLayers[0] : null;

        // Extract account IDs from selected accounts
        const accountIds = selectedAccounts.map(account => account.accountId);

        setIsDownloadSubmitting(true);

        try {
            // Sử dụng giá trị mặc định "system" cho employeeId
            const response = await createDownloadProcess(
                "system", // Default employee ID
                selectedClient?.id || "",
                accountIds,
                downloadLevel,
                filters,
            );

            console.log("Download process created:", response);

            // Show success toast with the process ID
            toast.success(
                `ダウンロードリクエストが送信されました。プロセスID: ${response.id} (Download request submitted. Process ID: ${response.id})`,
            );

            setDownloadSuccess(true);

            // Clear form fields after successful submission except Employee ID
            setSelectedAccounts([]);
            setSelectedDataLayers([]);
            setFilters([]);

            // Show navigation confirmation dialog
            setShowNavigationConfirm(true);

            // Reset success message after 5 seconds
            setTimeout(() => setDownloadSuccess(false), 5000);
        } catch (error) {
            console.error("Error submitting download request:", error);

            // Handle different types of errors
            let errorMessage =
                "エラーが発生しました。後でもう一度お試しください。(An error occurred. Please try again later.)";

            if (error instanceof Response) {
                if (error.status === 400) {
                    errorMessage =
                        "リクエストが無効です。入力内容を確認してください。(Invalid request. Please check your input.)";
                } else if (error.status === 401) {
                    errorMessage =
                        "認証が必要です。再度ログインしてください。(Authentication required. Please log in again.)";
                }
            } else if (error instanceof Error) {
                errorMessage = `${error.message}`;
            }

            toast.error(errorMessage);
        } finally {
            setIsDownloadSubmitting(false);
        }
    }, [
        selectedAccounts,
        selectedDataLayers,
        selectedClient,
        filters,
        setSelectedAccounts,
        setSelectedDataLayers,
        setFilters,
        setShowNavigationConfirm,
    ]);

    // Hàm xử lý khi xác nhận chuyển hướng sang activity-log
    const handleNavigateToActivityLog = useCallback(() => {
        if (selectedClient) {
            // Đóng dialog
            setShowNavigationConfirm(false);

            // Chuyển hướng sang trang activity-log với clientId là query param
            router.push(
                `/parameter-storage/activity-log?clientId=${selectedClient.id}`,
            );
        }
    }, [selectedClient, router]);

    // Hàm đóng dialog xác nhận chuyển hướng mà không thực hiện chuyển hướng
    const handleCloseNavigationDialog = useCallback(() => {
        setShowNavigationConfirm(false);
    }, []);

    // Thêm handler cho việc export CSV
    const handleExportCSV = useCallback(
        (filename?: string) => {
            if (data.length === 0) return;

            downloadCSV(data, filters, searchTerm, filename);
        },
        [data, filters, searchTerm],
    );

    // Thêm hàm xử lý xác nhận thay đổi client
    const handleConfirmClientChange = useCallback(() => {
        setSelectedClient(pendingClientChange);
        // Clear file và data
        setFile(null);
        setData([]);
        setValidationErrors([]);
        setIsValid(false);
        // Đóng dialog
        setShowClientChangeConfirm(false);
    }, [pendingClientChange]);

    // Thêm hàm hủy thay đổi client
    const handleCancelClientChange = useCallback(() => {
        setPendingClientChange(null);
        setShowClientChangeConfirm(false);
    }, []);

    return {
        mode,
        selectedClient,
        file,
        data,
        validationErrors,
        isValid,
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
        lastUploadResponse,
        clientId: selectedClient?.id || null, // Add clientId for account filter

        // Export the new state variables
        employeeId,
        isDownloadSubmitting,
        downloadSuccess,

        handleModeChange,
        handleClientSelect,
        handleFileSelect,
        handleValidationComplete,
        handleSubmitData,
        handleFilterChange,
        // Thêm các handlers mới
        handlePageChange,
        handleItemsPerPageChange,
        handleSearch,
        handleExportCSV,
        // Export the new handler
        handleDownloadSubmit,
        // Giữ lại các setters để hỗ trợ các trường hợp khác
        setFilters,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
        // Export new setter
        setEmployeeId,
        // Thêm handlers cho dialog xác nhận
        handleConfirmClientChange,
        handleCancelClientChange,
        // Thêm handlers cho navigation dialog
        handleNavigateToActivityLog,
        handleCloseNavigationDialog,
        // Handlers for new filters
        handleAccountSelect,
        handleDataLayerSelect,
    };
}
