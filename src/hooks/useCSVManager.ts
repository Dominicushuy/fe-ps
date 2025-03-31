import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
    CSVManagerMode,
    CSVRow,
    Client,
    ValidationError,
    ColumnFilter,
} from "@/types";
import { mockCSVData } from "@/data/mock-csv-data";
import { downloadCSV } from "@/lib/utils/csv-export";

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

    // Thêm state cho dialog xác nhận thay đổi client
    const [showClientChangeConfirm, setShowClientChangeConfirm] =
        useState(false);
    const [pendingClientChange, setPendingClientChange] =
        useState<Client | null>(null);

    // Thêm state cho navigation confirm dialog
    const [showNavigationConfirm, setShowNavigationConfirm] = useState(false);

    // Effect mới để load mock data khi ở chế độ Download
    useEffect(() => {
        if (mode === CSVManagerMode.DOWNLOAD) {
            setData(mockCSVData);
            setIsValid(true);
        }
    }, [mode]);

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

    // Cập nhật hàm handleSubmitData để hiển thị toast và navigation dialog
    const handleSubmitData = useCallback(() => {
        if (!isValid) return;

        setIsSubmitting(true);

        // Giả lập quá trình submit
        setTimeout(() => {
            // Trong trường hợp thực tế, đây là nơi bạn sẽ gửi dữ liệu lên server
            console.log("Submitting data:", data);

            // Clear file và data sau khi submit thành công
            setFile(null);

            // Giữ lại data trong state để hiển thị thông báo thành công (optional)
            // setData([...data]);

            // Hiển thị thông báo thành công với toast
            toast.success(
                "データが正常にアップロードされました！(Data successfully uploaded!)",
                {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                },
            );

            // Hiển thị dialog xác nhận chuyển hướng
            setShowNavigationConfirm(true);

            setIsSubmitting(false);
        }, 1500);
    }, [isValid, data]);

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
        // Thêm handlers cho dialog xác nhận
        handleConfirmClientChange,
        handleCancelClientChange,
        // Thêm handlers cho navigation dialog
        handleNavigateToActivityLog,
        handleCloseNavigationDialog,
        // Giữ lại các setters để hỗ trợ các trường hợp khác
        setFilters,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
    };
}
