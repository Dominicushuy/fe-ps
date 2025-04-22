// src/hooks/useActivityManager.ts

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Client } from "@/types";
import {
    ActivityFilters,
    DateFilterOption,
    ActivityStatus,
    ActivityType,
} from "@/types/activity-types";
import { mockActivities } from "@/data/mock-activities";
import { useClients } from "@/hooks/useClients";

export const useActivityManager = () => {
    // Get URL parameters
    const searchParams = useSearchParams();
    const clientIdParam = searchParams ? searchParams.get("clientId") : null;

    const { clients, isLoading } = useClients({
        limit: 500,
        // Always fetch clients for the dropdown, regardless of URL parameter
        enabled: true,
    });

    const [filters, setFilters] = useState<ActivityFilters>({
        client: null,
        dateOption: "Last7Days",
        customStartDate: null,
        customEndDate: null,
        type: "All",
        status: "All",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Track if we've tried to process the URL parameter
    const [urlParamProcessed, setUrlParamProcessed] = useState(false);

    // Handle client selection from URL parameter
    useEffect(() => {
        // Only run if:
        // 1. We have a clientIdParam
        // 2. We haven't processed it yet
        // 3. Client data has loaded
        // 4. No client is already selected (to avoid overriding user selection)
        if (
            clientIdParam &&
            !urlParamProcessed &&
            !isLoading &&
            clients.length > 0 &&
            !filters.client
        ) {
            // Try to find client by ID or accountId
            const client = clients.find(
                c => c.id === clientIdParam || c.accountId === clientIdParam,
            );

            if (client) {
                console.log(
                    `Auto-selecting client from URL: ${client.name} (ID: ${client.id})`,
                );
                setFilters(prev => ({ ...prev, client }));
            } else {
                console.warn(
                    `Client with ID "${clientIdParam}" not found in available clients`,
                );
            }

            // Mark as processed regardless of whether we found the client
            setUrlParamProcessed(true);
        }
    }, [clientIdParam, urlParamProcessed, clients, isLoading, filters.client]);

    const activities = useMemo(() => {
        if (clients.length === 0) return mockActivities;

        return mockActivities.map(activity => {
            const matchingClient =
                clients.find(c => c.id === activity.client.id) ||
                activity.client;
            return { ...activity, client: matchingClient };
        });
    }, [clients]);

    // Filter activities based on selected filters
    const filteredData = useMemo(() => {
        let result = [...activities];

        if (filters.client) {
            result = result.filter(
                activity => activity.client.id === filters.client?.id,
            );
        }

        const now = new Date();
        const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
        );
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const last3Days = new Date(today);
        last3Days.setDate(last3Days.getDate() - 3);

        const last7Days = new Date(today);
        last7Days.setDate(last7Days.getDate() - 7);

        switch (filters.dateOption) {
            case "Today":
                result = result.filter(activity => activity.startTime >= today);
                break;
            case "Yesterday":
                result = result.filter(
                    activity =>
                        activity.startTime >= yesterday &&
                        activity.startTime < today,
                );
                break;
            case "Last3Days":
                result = result.filter(
                    activity => activity.startTime >= last3Days,
                );
                break;
            case "Last7Days":
                result = result.filter(
                    activity => activity.startTime >= last7Days,
                );
                break;
            case "Custom":
                if (filters.customStartDate) {
                    result = result.filter(
                        activity =>
                            activity.startTime >= filters.customStartDate!,
                    );
                }
                if (filters.customEndDate) {
                    const endDatePlusOne = new Date(filters.customEndDate);
                    endDatePlusOne.setDate(endDatePlusOne.getDate() + 1);
                    result = result.filter(
                        activity => activity.startTime < endDatePlusOne,
                    );
                }
                break;
        }

        if (filters.type !== "All") {
            result = result.filter(activity => activity.type === filters.type);
        }

        if (filters.status !== "All") {
            result = result.filter(
                activity => activity.status === filters.status,
            );
        }

        return result;
    }, [filters, activities]);

    // Paginate the filtered data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Client selection handler
    const handleClientSelect = useCallback((client: Client | null) => {
        setFilters(prev => ({ ...prev, client }));
    }, []);

    const handleDateOptionChange = useCallback(
        (dateOption: DateFilterOption) => {
            setFilters(prev => ({ ...prev, dateOption }));
        },
        [],
    );

    const handleCustomDateChange = useCallback(
        (startDate: Date | null, endDate: Date | null) => {
            setFilters(prev => ({
                ...prev,
                customStartDate: startDate,
                customEndDate: endDate,
                dateOption: "Custom",
            }));
        },
        [],
    );

    const handleTypeChange = useCallback((type: ActivityType | "All") => {
        setFilters(prev => ({ ...prev, type }));
    }, []);

    const handleStatusChange = useCallback((status: ActivityStatus | "All") => {
        setFilters(prev => ({ ...prev, status }));
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleItemsPerPageChange = useCallback((items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    }, []);

    return {
        filters,
        filteredData,
        paginatedData,
        currentPage,
        itemsPerPage,
        totalItems: filteredData.length,
        handleClientSelect,
        handleDateOptionChange,
        handleCustomDateChange,
        handleTypeChange,
        handleStatusChange,
        handlePageChange,
        handleItemsPerPageChange,
        isLoadingClients: isLoading,
    };
};
