// src/hooks/useActivityManager.ts

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Client } from "@/types";
import {
    ActivityFilters as UIActivityFilters,
    DateFilterOption,
    ActivityStatus,
    ActivityType,
} from "@/types/activity-types";
import { useClients } from "@/hooks/useClients";
import { useActivityQuery } from "./useActivityQuery";

export const useActivityManager = () => {
    // Get URL parameters
    const searchParams = useSearchParams();
    const clientIdParam = searchParams ? searchParams.get("clientId") : null;

    const { clients, isLoading: isLoadingClients } = useClients({
        limit: 500,
        enabled: true,
    });

    const [filters, setFilters] = useState<UIActivityFilters>({
        client: null,
        dateOption: "Last7Days",
        customStartDate: null,
        customEndDate: null,
        type: "All",
        status: "All",
        isDuplicatable: null,
        searchTerm: "",
    });

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Track if we've tried to process the URL parameter
    const [urlParamProcessed, setUrlParamProcessed] = useState(false);

    // Handle client selection from URL parameter
    useEffect(() => {
        if (
            clientIdParam &&
            !urlParamProcessed &&
            !isLoadingClients &&
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
    }, [
        clientIdParam,
        urlParamProcessed,
        clients,
        isLoadingClients,
        filters.client,
    ]);

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

    const handleDuplicatableChange = useCallback(
        (isDuplicatable: boolean | null) => {
            setFilters(prev => ({ ...prev, isDuplicatable }));
        },
        [],
    );

    const handleSearchChange = useCallback((searchTerm: string) => {
        setFilters(prev => ({ ...prev, searchTerm }));
    }, []);

    // Use the React Query hook to fetch activities
    const {
        data,
        isLoading: isLoadingActivities,
        error,
        refetch,
    } = useActivityQuery({
        clientId: filters.client?.id || null,
        status: filters.status,
        type: filters.type,
        dateOption: filters.dateOption,
        customStartDate: filters.customStartDate,
        customEndDate: filters.customEndDate,
        isDuplicatable: filters.isDuplicatable,
        searchTerm: filters.searchTerm,
        page: currentPage,
        limit: itemsPerPage,
    });

    return {
        filters,
        paginatedData: data?.items || [],
        isLoading: isLoadingActivities,
        error,
        currentPage,
        itemsPerPage,
        totalItems: data?.totalCount || 0,
        handleClientSelect,
        handleDateOptionChange,
        handleCustomDateChange,
        handleTypeChange,
        handleStatusChange,
        handlePageChange,
        handleItemsPerPageChange,
        handleDuplicatableChange,
        handleSearchChange,
        fetchActivities: refetch,
        isLoadingClients,
    };
};
