import { CSVRow, ColumnFilter } from "@/types";
import { applyFilters } from "./filter-utils";

/**
 * Chuyển đổi dữ liệu JSON thành chuỗi CSV
 */
export function convertToCSV(data: CSVRow[]): string {
    if (data.length === 0) return "";

    const headers = Object.keys(data[0]);

    // Tạo header row
    let csv =
        headers.map(header => `"${escapeQuotes(header)}"`).join(",") + "\n";

    // Thêm data rows
    csv += data
        .map(row => {
            return headers
                .map(header => {
                    const value =
                        row[header] !== undefined && row[header] !== null
                            ? row[header]
                            : "";
                    return `"${escapeQuotes(String(value))}"`;
                })
                .join(",");
        })
        .join("\n");

    return csv;
}

/**
 * Escape quotes trong chuỗi CSV
 */
function escapeQuotes(str: string): string {
    return str.replace(/"/g, '""');
}

/**
 * Tạo file CSV và kích hoạt download
 */
export function downloadCSV(
    data: CSVRow[],
    filters: ColumnFilter[],
    searchTerm: string,
    filename?: string,
): void {
    // Lọc dữ liệu nếu cần
    const filteredData = applyFilters(data, filters, searchTerm);

    // Chuyển đổi dữ liệu thành CSV
    const csv = convertToCSV(filteredData);

    // Tạo Blob
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    // Tạo URL cho Blob
    const url = URL.createObjectURL(blob);

    // Tạo tên file với timestamp
    const defaultFilename = `csv_export_${getFormattedDateTime()}.csv`;
    const finalFilename = filename || defaultFilename;

    // Tạo link tạm thời và simulate click để download
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", finalFilename);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * Tạo timestamp đẹp cho tên file
 */
function getFormattedDateTime(): string {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}
