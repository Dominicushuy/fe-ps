import { useState, useCallback, useEffect } from "react";
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
    const [mode, setMode] = useState<CSVManagerMode>(CSVManagerMode.DOWNLOAD);
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

    const handleClientSelect = useCallback((client: Client | null) => {
        setSelectedClient(client);
    }, []);

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

    const handleSubmitData = useCallback(() => {
        if (!isValid) return;

        setIsSubmitting(true);

        // Giả lập quá trình submit
        setTimeout(() => {
            // Trong trường hợp thực tế, đây là nơi bạn sẽ gửi dữ liệu lên server
            console.log("Submitting data:", data);
            setIsSubmitting(false);

            // Sau khi submit thành công, lưu dữ liệu vào state để hiển thị
            setData([...data]);
        }, 1500);
    }, [isValid, data]);

    // Thêm handler cho việc export CSV
    const handleExportCSV = useCallback(
        (filename?: string) => {
            if (data.length === 0) return;

            downloadCSV(data, filters, searchTerm, filename);
        },
        [data, filters, searchTerm],
    );

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
        // Giữ lại các setters để hỗ trợ các trường hợp khác
        setFilters,
        setSearchTerm,
        setCurrentPage,
        setItemsPerPage,
    };
}
