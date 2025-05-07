// src/hooks/useActivityQuery.ts
import { useQuery } from "@tanstack/react-query";
import {
    fetchActivities,
    convertApiActivityToActivity,
    ActivityFilters as ApiActivityFilters,
} from "@/lib/api/activity";
import {
    ActivityStatus,
    DateFilterOption,
    ActivityType,
} from "@/types/activity-types";
import { useClients } from "./useClients";

interface UseActivityQueryParams {
    clientId?: string | null;
    employeeId?: string | null;
    status?: ActivityStatus | "All";
    type?: ActivityType | "All";
    dateOption: DateFilterOption;
    customStartDate: Date | null;
    customEndDate: Date | null;
    searchTerm: string;
    page: number;
    limit: number;
}

/**
 * Format date to YYYY-MM-DD format as required by the API
 */
const formatDateForApi = (date: Date): string => {
    return date.toISOString().split("T")[0]; // Get only the YYYY-MM-DD part
};

/**
 * Convert UI date filters to API date range parameters
 */
const getDateRange = (
    dateOption: DateFilterOption,
    customStartDate: Date | null,
    customEndDate: Date | null,
) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const last3Days = new Date(today);
    last3Days.setDate(last3Days.getDate() - 3);

    const last7Days = new Date(today);
    last7Days.setDate(last7Days.getDate() - 7);

    // Create tomorrow for the "to" date when needed
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    switch (dateOption) {
        case "Today":
            return {
                created_from: formatDateForApi(today),
                created_to: formatDateForApi(tomorrow),
            };
        case "Yesterday":
            return {
                created_from: formatDateForApi(yesterday),
                created_to: formatDateForApi(today),
            };
        case "Last3Days":
            return {
                created_from: formatDateForApi(last3Days),
                created_to: formatDateForApi(tomorrow),
            };
        case "Last7Days":
            return {
                created_from: formatDateForApi(last7Days),
                created_to: formatDateForApi(tomorrow),
            };
        case "Custom":
            return {
                created_from: customStartDate
                    ? formatDateForApi(customStartDate)
                    : undefined,
                created_to: customEndDate
                    ? formatDateForApi(
                          new Date(customEndDate.getTime() + 86400000),
                      )
                    : undefined,
            };
        default:
            return {};
    }
};

/**
 * React Query hook for fetching activities with filtering
 */
export function useActivityQuery({
    clientId,
    employeeId,
    status = "All",
    type = "All",
    dateOption,
    customStartDate,
    customEndDate,
    searchTerm,
    page,
    limit,
}: UseActivityQueryParams) {
    // Fetch clients for mapping client IDs to client objects
    const { clients, isLoading: isLoadingClients } = useClients({
        limit: 500,
        enabled: true,
    });

    return useQuery({
        queryKey: [
            "activities",
            {
                clientId,
                employeeId,
                status,
                type,
                dateOption,
                customStartDate,
                customEndDate,
                searchTerm,
                page,
                limit,
            },
        ],
        queryFn: async () => {
            const dateRange = getDateRange(
                dateOption,
                customStartDate,
                customEndDate,
            );

            const apiFilters: ApiActivityFilters = {
                page,
                limit,
                ...dateRange,
            };

            // Add client filter if selected
            if (clientId) {
                apiFilters.client_id = clientId;
            }

            // Add employee filter if selected
            if (employeeId) {
                apiFilters.employee_id = employeeId;
            }

            // Add type filter if selected
            if (type !== "All") {
                apiFilters.action_type = type.toLowerCase();
            }

            // Add status filter if selected
            if (status !== "All") {
                apiFilters.status = status;
            }

            // Add search term if provided
            if (searchTerm) {
                apiFilters.search = searchTerm;
            }

            const response = await fetchActivities(apiFilters);

            // Convert API activities to app activities
            const items = response.results.map(apiActivity =>
                convertApiActivityToActivity(apiActivity, clients),
            );

            return {
                items,
                totalCount: response.count,
                pageCount: Math.ceil(response.count / limit),
            };
        },
        enabled: !isLoadingClients,
        staleTime: 30000, // 30 seconds
        retry: 1,
    });
}
