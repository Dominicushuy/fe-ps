import { useState, useEffect, useMemo, useCallback } from "react";
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
    const { clients } = useClients({ limit: 500 });

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

    const activities = useMemo(() => {
        if (clients.length === 0) return mockActivities;

        return mockActivities.map(activity => {
            const matchingClient =
                clients.find(c => c.id === activity.client.id) ||
                activity.client;
            return { ...activity, client: matchingClient };
        });
    }, [clients]);

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

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

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
    };
};
