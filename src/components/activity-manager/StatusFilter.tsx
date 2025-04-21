// /components/activity-manager/StatusFilter.tsx

"use client";

import React from "react";
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/outline";
import { ActivityStatus } from "@/types/activity-types";

interface StatusFilterProps {
    selectedStatus: ActivityStatus | "All";
    onStatusChange: (status: ActivityStatus | "All") => void;
}

export default function StatusFilter({
    selectedStatus,
    onStatusChange,
}: StatusFilterProps) {
    // Define the status options with their icons and styling
    const statusOptions = [
        {
            value: "All",
            label: "All",
            icon: null,
            activeClass: "bg-primary-600 text-white",
            inactiveClass: "bg-gray-100 text-gray-700 hover:bg-gray-200",
        },
        {
            value: "waiting",
            label: "Waiting",
            icon: <ClockIcon className="h-3 w-3 mr-1" />,
            activeClass: "bg-yellow-600 text-white",
            inactiveClass: "bg-yellow-50 text-yellow-700 hover:bg-yellow-100",
        },
        {
            value: "processing",
            label: "Processing",
            icon: <ClockIcon className="h-3 w-3 mr-1" />,
            activeClass: "bg-blue-600 text-white",
            inactiveClass: "bg-blue-50 text-blue-700 hover:bg-blue-100",
        },
        {
            value: "done",
            label: "Done",
            icon: <CheckCircleIcon className="h-3 w-3 mr-1" />,
            activeClass: "bg-green-600 text-white",
            inactiveClass: "bg-green-50 text-green-700 hover:bg-green-100",
        },
        {
            value: "invalid",
            label: "Invalid",
            icon: <XCircleIcon className="h-3 w-3 mr-1" />,
            activeClass: "bg-orange-600 text-white",
            inactiveClass: "bg-orange-50 text-orange-700 hover:bg-orange-100",
        },
        {
            value: "error",
            label: "Error",
            icon: <ExclamationCircleIcon className="h-3 w-3 mr-1" />,
            activeClass: "bg-red-600 text-white",
            inactiveClass: "bg-red-50 text-red-700 hover:bg-red-100",
        },
    ];

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータスフィルター (Status Filter)
            </label>

            {/* Grid layout for status buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {statusOptions.map(option => (
                    <button
                        key={option.value}
                        className={`px-3 py-2 rounded text-center text-xs font-medium transition-colors
                            ${
                                selectedStatus === option.value
                                    ? option.activeClass
                                    : option.inactiveClass
                            }`}
                        onClick={() =>
                            onStatusChange(
                                option.value as ActivityStatus | "All",
                            )
                        }
                    >
                        <div className="flex items-center justify-center">
                            {option.icon}
                            <span className="truncate">{option.label}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}
