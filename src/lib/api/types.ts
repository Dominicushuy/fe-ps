// src/lib/api/types.ts
export interface CaClient {
    client_id: string;
    client_name: string;
    created?: string;
    modified?: string;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export interface ClientParams {
    search?: string;
    ordering?: string;
    page?: number;
    limit?: number;
}

// Media API response types
export interface CaMedia {
    media_id: string;
    created?: string;
    modified?: string;
    media_name: string;
    logo_image_path?: string;
}

export interface MediaListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: CaMedia[];
}

// Accounts API response types
export interface MediaInfo {
    media_id: string;
    media_name: string;
    logo_image_path?: string; // This can be null or "nan"
}

export interface ApiMediaAccount {
    media_account_id: string;
    media_account_name: string;
    media?: MediaInfo;
}

export interface AccountListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ApiMediaAccount[];
}
