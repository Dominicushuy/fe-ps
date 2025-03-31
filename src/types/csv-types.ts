// Enum cho các mode của trang
export enum CSVManagerMode {
    UPLOAD = "upload",
    DOWNLOAD = "download",
}

// Type cho Client
export interface Client {
    id: string;
    accountId: string;
    name: string;
}

// Type cho dữ liệu CSV - đã cập nhật để phù hợp với template
export interface CSVRow {
    Action: string;
    媒体ID: string;
    CID: string;
    アカウントID: string;
    キャンペーンID: string;
    キャンペーン名: string;
    広告グループID: string;
    広告グループ名: string;
    広告ID: string;
    キーワードID: string;
    パラメ発行済みURL: string;
    ドラフト停止日: string;
    [key: string]: string;
}

// Type cho ValidationError
export interface ValidationError {
    rowIndex: number;
    columnName: string;
    message: string;
    value?: string;
}

// Type cho Filter
export type FilterOperator =
    | "all" // 全て
    | "contains" // (複数)テキスト: 含む
    | "notContains" // (複数)テキスト: 含まない
    | "startsWith" // (複数)テキスト: 次で始まる
    | "endsWith" // (複数)テキスト: 次で終わる
    | "equals" // (複数)テキスト: 等しい
    | "notEquals" // (複数)テキスト: 等しくない
    | "containsLowerCase" // (複数)テキスト: 含む(小文字)
    | "notContainsLowerCase" // (複数)テキスト: 含まない(小文字)
    | "startsWithLowerCase" // (複数)テキスト: 次で始まる(小文字)
    | "endsWithLowerCase" // (複数)テキスト: 次で終わる(小文字)
    | "equalsLowerCase" // (複数)テキスト: 等しい(小文字)
    | "notEqualsLowerCase" // (複数)テキスト: 等しくない(小文字)
    | "other"; // 上記以外 （残り）

export interface ColumnFilter {
    id: string;
    columnName: string;
    operator: FilterOperator;
    value: string;
}

export interface CSVState {
    mode: CSVManagerMode;
    selectedClient: Client | null;
    file: File | null;
    data: CSVRow[];
    validationErrors: ValidationError[];
    isValid: boolean;
    filters: ColumnFilter[];
    searchTerm: string;
    currentPage: number;
    itemsPerPage: number;
}

export interface ValidationError {
    rowIndex: number;
    columnName: string;
    message: string;
    value?: string;
}

export interface CSVValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    data: CSVRow[];
    hasColumnError: boolean;
    hasCellError: boolean;
}

// Cấu trúc của một bộ lọc
export interface ColumnFilter {
    id: string; // Unique id for each filter
    columnName: string;
    operator: FilterOperator;
    value: string;
}