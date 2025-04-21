// src/lib/api/client.ts

import { CaClient, ClientParams, PaginatedResponse } from "./types";
import fetchWithAuth from "./fetchUtils";

export async function fetchClients(
    params?: ClientParams,
): Promise<PaginatedResponse<CaClient>> {
    const queryParams = new URLSearchParams();

    // console.log("params", params);

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

    return fetchWithAuth(`/param-storage/ca-client/${queryString}`);
}
