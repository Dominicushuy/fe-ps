import { CSVRow, ColumnFilter } from "@/types";

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
                // Removed "ALL" and "other" cases
                case "CASE_EQUAL":
                    return value === filterValue;

                case "CASE_NOT_EQUAL":
                    return value !== filterValue;

                case "CASE_CONTAIN_AND": {
                    if (typeof value !== "string") return false;
                    // Split filter value by line and check if ALL values are contained in the text
                    const andValues = filterValue
                        .split("\n")
                        .filter(v => v.trim());
                    return (
                        andValues.length === 0 ||
                        andValues.every(v => value.includes(v.trim()))
                    );
                }

                case "CASE_CONTAIN_OR": {
                    if (typeof value !== "string") return false;
                    // Split filter value by line and check if ANY value is contained in the text
                    const orValues = filterValue
                        .split("\n")
                        .filter(v => v.trim());
                    return (
                        orValues.length === 0 ||
                        orValues.some(v => value.includes(v.trim()))
                    );
                }

                case "CASE_NOT_CONTAIN":
                    return (
                        typeof value === "string" &&
                        !value.includes(filterValue)
                    );

                case "CASE_START_WITH":
                    return (
                        typeof value === "string" &&
                        value.startsWith(filterValue)
                    );

                case "CASE_END_WITH":
                    return (
                        typeof value === "string" && value.endsWith(filterValue)
                    );

                case "EQUAL":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase() === filterValue.toLowerCase()
                    );

                case "NOT_EQUAL":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase() !== filterValue.toLowerCase()
                    );

                case "CONTAIN_AND": {
                    if (typeof value !== "string") return false;
                    // Split filter value by line and check if ALL values are contained in the text (case insensitive)
                    const andLowerValues = filterValue
                        .split("\n")
                        .filter(v => v.trim());
                    return (
                        andLowerValues.length === 0 ||
                        andLowerValues.every(v =>
                            value
                                .toLowerCase()
                                .includes(v.trim().toLowerCase()),
                        )
                    );
                }

                case "CONTAIN_OR": {
                    if (typeof value !== "string") return false;
                    // Split filter value by line and check if ANY value is contained in the text (case insensitive)
                    const orLowerValues = filterValue
                        .split("\n")
                        .filter(v => v.trim());
                    return (
                        orLowerValues.length === 0 ||
                        orLowerValues.some(v =>
                            value
                                .toLowerCase()
                                .includes(v.trim().toLowerCase()),
                        )
                    );
                }

                case "NOT_CONTAIN":
                    return (
                        typeof value === "string" &&
                        !value.toLowerCase().includes(filterValue.toLowerCase())
                    );

                case "START_WITH":
                    return (
                        typeof value === "string" &&
                        value
                            .toLowerCase()
                            .startsWith(filterValue.toLowerCase())
                    );

                case "END_WITH":
                    return (
                        typeof value === "string" &&
                        value.toLowerCase().endsWith(filterValue.toLowerCase())
                    );

                default:
                    return true;
            }
        });
    });
}

/**
 * Tạo một filter mới - cập nhật để sử dụng toán tử mặc định thay vì "ALL"
 */
export function createNewFilter(columnName: string): ColumnFilter {
    return {
        id: `filter_${Math.random().toString(36).substr(2, 9)}`,
        columnName,
        operator: "CASE_CONTAIN_OR", // Operator hợp lệ từ danh sách OPERATOR_CHOICES
        value: "",
    };
}
