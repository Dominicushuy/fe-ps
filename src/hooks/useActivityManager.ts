// /hooks/useActivityManager.ts

import { useState, useEffect, useMemo } from "react";
import { Client } from "@/types";
import {
    ActivityFilters,
    DateFilterOption,
    ActivityStatus,
    ActivityType,
} from "@/types/activity-types";
import { mockActivities } from "@/data/mock-activities";

export const useActivityManager = () => {
    // State for filters
    const [filters, setFilters] = useState<ActivityFilters>({
        client: null,
        dateOption: "Last7Days",
        customStartDate: null,
        customEndDate: null,
        type: "All",
        status: "All",
    });

    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtered data based on filters
    const filteredData = useMemo(() => {
        let result = [...mockActivities];

        // Filter by client
        if (filters.client) {
            result = result.filter(
                activity => activity.client.id === filters.client?.id,
            );
        }

        // Filter by date
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

        // Filter by type
        if (filters.type !== "All") {
            result = result.filter(activity => activity.type === filters.type);
        }

        // Filter by status
        if (filters.status !== "All") {
            result = result.filter(
                activity => activity.status === filters.status,
            );
        }

        return result;
    }, [filters]);

    // Paginated data
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredData.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredData, currentPage, itemsPerPage]);

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters]);

    // Handlers
    const handleClientSelect = (client: Client | null) => {
        setFilters(prev => ({ ...prev, client }));
    };

    const handleDateOptionChange = (dateOption: DateFilterOption) => {
        setFilters(prev => ({ ...prev, dateOption }));
    };

    const handleCustomDateChange = (
        startDate: Date | null,
        endDate: Date | null,
    ) => {
        setFilters(prev => ({
            ...prev,
            customStartDate: startDate,
            customEndDate: endDate,
            dateOption: "Custom",
        }));
    };

    const handleTypeChange = (type: ActivityType | "All") => {
        setFilters(prev => ({ ...prev, type }));
    };

    const handleStatusChange = (status: ActivityStatus | "All") => {
        setFilters(prev => ({ ...prev, status }));
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (items: number) => {
        setItemsPerPage(items);
        setCurrentPage(1);
    };

    return {
        filters,
        filteredData, // Thêm filteredData để truy cập trước khi phân trang
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
