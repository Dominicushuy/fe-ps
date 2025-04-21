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
