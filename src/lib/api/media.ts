// src/lib/api/media.ts
import fetchWithAuth from "./fetchUtils";
import { MediaListResponse, AccountListResponse } from "./types";

/**
 * Fetch media list from API
 */
export async function fetchMediaList(params?: {
    search?: string;
    ordering?: string;
    page?: number;
    limit?: number;
}): Promise<MediaListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.search !== undefined)
        queryParams.append("search", params.search || "");
    if (params?.ordering !== undefined)
        queryParams.append("ordering", params.ordering || "");
    if (params?.page !== undefined)
        queryParams.append("page", params.page.toString() || "1");

    const limit = params?.limit || 20;
    queryParams.append("limit", limit.toString());

    const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

    return fetchWithAuth(`/param-storage/media/${queryString}`);
}

/**
 * Fetch accounts for a specific client
 */
export async function fetchClientAccounts(
    clientId: string,
    params?: {
        page?: number;
        limit?: number;
    },
): Promise<AccountListResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page !== undefined)
        queryParams.append("page", params.page.toString() || "1");

    const limit = params?.limit || 20;
    queryParams.append("limit", limit.toString());

    const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

    return fetchWithAuth(`/param-storage/${clientId}/accounts/${queryString}`);
}
