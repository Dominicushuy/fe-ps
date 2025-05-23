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

// Media type (new)
export interface Media {
    id: string;
    name: string;
    logoPath?: string;
}

// Account type (expanded from existing Client type)
// Updated MediaAccount interface
export interface MediaAccount {
    id: string;
    mediaId: string;
    mediaName: string;
    accountId: string;
    name: string;
    logoPath?: string | null; // Add logo path field
}

// Data layer type with new format matching backend enum
export type DataLayer =
    | "campaign"
    | "ad_group"
    | "ad"
    | "keyword"
    | "ad_and_keyword";

// Helper type to define UI display options
export type DataLayerUIOption = "campaign" | "ad_group" | "ad" | "keyword";

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
    | "ALL" // 全て
    | "CASE_CONTAIN_AND" // (複数)テキスト: 含む AND
    | "CASE_CONTAIN_OR" // (複数)テキスト: 含む OR
    | "CASE_NOT_CONTAIN" // (複数)テキスト: 含まない
    | "CASE_START_WITH" // (複数)テキスト: 次で始まる
    | "CASE_END_WITH" // (複数)テキスト: 次で終わる
    | "CASE_EQUAL" // (複数)テキスト: 等しい
    | "CASE_NOT_EQUAL" // (複数)テキスト: 等しくない
    | "CONTAIN_AND" // (複数)テキスト: 含む(小文字) AND
    | "CONTAIN_OR" // (複数)テキスト: 含む(小文字) OR
    | "NOT_CONTAIN" // (複数)テキスト: 含まない(小文字)
    | "START_WITH" // (複数)テキスト: 次で始まる(小文字)
    | "END_WITH" // (複数)テキスト: 次で終わる(小文字)
    | "EQUAL" // (複数)テキスト: 等しい(小文字)
    | "NOT_EQUAL" // (複数)テキスト: 等しくない(小文字)
    | "other"; // 上記以外 （残り）

export interface ColumnFilter {
    id: string;
    columnName: string;
    operator: FilterOperator;
    value: string;
}

// Updated CSVState with new filter states
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

    // New properties
    selectedMedia: Media[];
    selectedAccounts: MediaAccount[];
    selectedDataLayers: DataLayer[];
}

export interface CSVValidationResult {
    isValid: boolean;
    errors: ValidationError[];
    data: CSVRow[];
    hasColumnError: boolean;
    hasCellError: boolean;
}
