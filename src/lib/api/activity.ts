// src/lib/api/activity.ts
import fetchWithAuth from "./fetchUtils";
import { ActivityStatus, ActivityType } from "@/types/activity-types";
import { Client } from "@/types";

export interface ActivityFilters {
    search?: string;
    ordering?: string;
    created_from?: string;
    created_to?: string;
    employee_id?: string;
    client_id?: string;
    action_type?: string;
    status?: string;
    is_duplicatable?: boolean;
    page?: number;
    limit?: number;
}

export interface ApiActivity {
    id: string;
    created: string;
    modified: string;
    employee_id: string;
    client_id: string;
    action_type: string;
    filter_details: Record<string, any>;
    status: string;
    start_time: string | null;
    end_time: string | null;
    is_duplicatable: boolean;
    file_path: string | null;
    batch_id: string | null;
    download_level: string | null;
}

export interface ActivityListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: ApiActivity[];
}

/**
 * Convert API activity to application Activity type
 */
export function convertApiActivityToActivity(
    apiActivity: ApiActivity,
    clients: Client[],
) {
    // Find client by ID
    const client = clients.find(c => c.id === apiActivity.client_id) || {
        id: apiActivity.client_id,
        accountId: apiActivity.client_id,
        name: `Unknown Client (${apiActivity.client_id})`,
    };

    return {
        id: apiActivity.id,
        startTime: apiActivity.start_time
            ? new Date(apiActivity.start_time)
            : new Date(apiActivity.created),
        endTime: apiActivity.end_time ? new Date(apiActivity.end_time) : null,
        client,
        status: apiActivity.status as ActivityStatus,
        user: apiActivity.employee_id,
        type:
            apiActivity.action_type === "download"
                ? ("Download" as ActivityType)
                : ("Upload" as ActivityType),
        s3Link: apiActivity.file_path || undefined, // Convert null to undefined
        filename: apiActivity.file_path
            ? apiActivity.file_path.split("/").pop() || `file-${apiActivity.id}`
            : undefined,
    };
}

/**
 * Fetch activities from the API
 */
export async function fetchActivities(
    filters: ActivityFilters = {},
): Promise<ActivityListResponse> {
    const queryParams = new URLSearchParams();

    // Add all filters to query params if defined
    if (filters.search) queryParams.append("search", filters.search);
    if (filters.ordering) queryParams.append("ordering", filters.ordering);
    if (filters.created_from)
        queryParams.append("created_from", filters.created_from);
    if (filters.created_to)
        queryParams.append("created_to", filters.created_to);
    if (filters.employee_id)
        queryParams.append("employee_id", filters.employee_id);
    if (filters.client_id) queryParams.append("client_id", filters.client_id);
    if (filters.action_type)
        queryParams.append("action_type", filters.action_type.toLowerCase());
    if (filters.status) queryParams.append("status", filters.status);
    if (filters.is_duplicatable !== undefined)
        queryParams.append(
            "is_duplicatable",
            filters.is_duplicatable.toString(),
        );
    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());

    const queryString = queryParams.toString()
        ? `?${queryParams.toString()}`
        : "";

    return fetchWithAuth(`/param-storage/file-process/${queryString}`);
}
