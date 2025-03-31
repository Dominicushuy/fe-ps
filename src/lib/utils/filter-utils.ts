import { CSVRow, ColumnFilter } from "@/types";

/**
 * Áp dụng tất cả các bộ lọc vào dữ liệu
 */
export function applyFilters(
    data: CSVRow[],
    filters: ColumnFilter[],
    searchTerm: string,
): CSVRow[] {
    return data.filter(row => {
        // Áp dụng tìm kiếm toàn cục
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const rowMatchesSearch = Object.values(row).some(
                value =>
                    typeof value === "string" &&
                    value.toLowerCase().includes(searchLower),
            );
            if (!rowMatchesSearch) return false;
        }

        // Áp dụng các bộ lọc cụ thể
        return filters.every(filter => {
            const value = row[filter.columnName];
            const filterValue = filter.value;

            switch (filter.operator) {
                case "all":
                    // Toán tử "all" luôn khớp với tất cả các hàng
                    return true;

                case "equals":
                    return value === filterValue;

                case "notEquals":
                    return value !== filterValue;

                case "contains":
                    return (
                        typeof value === "string" && value.includes(filterValue)
                    );

                case "notContains":
                    return (
                        typeof value === "string" &&
                        !value.includes(filterValue)
                    );

                case "startsWith":
                    return (
                        typeof value === "string" &&
                        value.startsWith(filterValue)
                    );

                case "endsWith":
                    return (
                        typeof value === "string" && value.endsWith(filterValue)
                    );

                case "equalsLowerCase":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase() === filterValue.toLowerCase()
                    );

                case "notEqualsLowerCase":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase() !== filterValue.toLowerCase()
                    );

                case "containsLowerCase":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase().includes(filterValue.toLowerCase())
                    );

                case "notContainsLowerCase":
                    return (
                        typeof value === "string" &&
                        !value.toLowerCase().includes(filterValue.toLowerCase())
                    );

                case "startsWithLowerCase":
                    return (
                        typeof value === "string" &&
                        value
                            .toLowerCase()
                            .startsWith(filterValue.toLowerCase())
                    );

                case "endsWithLowerCase":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase().endsWith(filterValue.toLowerCase())
                    );

                case "other":
                    // Trả về true nếu giá trị không khớp với bất kỳ điều kiện nào ở trên
                    // Có thể cần logic cụ thể hơn tùy theo yêu cầu
                    return true;

                default:
                    return true;
            }
        });
    });
}

/**
 * Tạo một filter mới
 */
export function createNewFilter(columnName: string): ColumnFilter {
    return {
        id: `filter_${Math.random().toString(36).substr(2, 9)}`,
        columnName,
        operator: "all",
        value: "",
    };
}
