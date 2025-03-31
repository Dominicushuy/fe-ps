// /components/activity-manager/StatusFilter.tsx

"use client";

import React from "react";
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
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
    // Định nghĩa các status với màu sắc và icon tương ứng để tái sử dụng mã
    const statusOptions = [
        {
            value: "All",
            label: "All",
            icon: null,
            activeClass: "bg-primary-600 text-white border-primary-600",
            hoverClass: "hover:bg-gray-50",
        },
        {
            value: "Success",
            label: "Success",
            icon: (
                <CheckCircleIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            ),
            activeClass: "bg-green-600 text-white border-green-600",
            hoverClass: "hover:bg-green-50",
        },
        {
            value: "Processing",
            label: "Processing",
            icon: <ClockIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />,
            activeClass: "bg-blue-600 text-white border-blue-600",
            hoverClass: "hover:bg-blue-50",
        },
        {
            value: "Failed",
            label: "Failed",
            icon: (
                <ExclamationCircleIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            ),
            activeClass: "bg-red-600 text-white border-red-600",
            hoverClass: "hover:bg-red-50",
        },
    ];

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                ステータスフィルター (Status Filter)
            </label>
            <div className="flex shadow-sm">
                {statusOptions.map((option, index) => {
                    // Xác định kiểu border-radius cho từng nút
                    const isFirst = index === 0;
                    const isLast = index === statusOptions.length - 1;
                    const borderRadiusClass = isFirst
                        ? "rounded-l-md "
                        : isLast
                        ? "rounded-r-md "
                        : "";

                    // Xác định trạng thái active
                    const isActive = selectedStatus === option.value;

                    // Xác định class cho nút
                    const buttonClass = `
                        relative flex-1 h-10 flex items-center justify-center text-xs font-medium 
                        ${borderRadiusClass}
                        ${
                            isActive
                                ? option.activeClass
                                : `bg-white text-gray-700 border-gray-300 ${option.hoverClass}`
                        }
                        border focus:outline-none focus:ring-1
                        ${
                            isActive
                                ? ""
                                : "focus:ring-primary-500 focus:border-primary-500"
                        }
                    `;

                    return (
                        <button
                            key={option.value}
                            type="button"
                            className={buttonClass}
                            onClick={() =>
                                onStatusChange(
                                    option.value as ActivityStatus | "All",
                                )
                            }
                        >
                            <div className="flex items-center whitespace-nowrap">
                                {option.icon}
                                <span className="truncate">{option.label}</span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
