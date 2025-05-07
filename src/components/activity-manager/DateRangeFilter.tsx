// /components/activity-manager/DateRangeFilter.tsx

"use client";

import React, { useState, useRef, useEffect } from "react";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { DateFilterOption } from "@/types/activity-types";
import { useTranslations } from "next-intl";

interface DateRangeFilterProps {
    dateOption: DateFilterOption;
    customStartDate: Date | null;
    customEndDate: Date | null;
    onDateOptionChange: (option: DateFilterOption) => void;
    onCustomDateChange: (startDate: Date | null, endDate: Date | null) => void;
}

export default function DateRangeFilter({
    dateOption,
    customStartDate,
    customEndDate,
    onDateOptionChange,
    onCustomDateChange,
}: DateRangeFilterProps) {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Handle clicking outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        }

        // Register event when dropdown is open
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        // Cleanup function
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const formatDate = (date: Date | null) => {
        if (!date) return "";
        return date.toISOString().split("T")[0];
    };

    // Display text for the selected option
    const getSelectedOptionText = () => {
        switch (dateOption) {
            case "Today":
                return t("today");
            case "Yesterday":
                return t("yesterday");
            case "Last3Days":
                return t("last3Days");
            case "Last7Days":
                return t("last7Days");
            case "Custom":
                return t("custom");
            default:
                return t("selectDateRange");
        }
    };

    return (
        <div className="w-full">
            <div ref={dropdownRef} className="relative">
                <button
                    type="button"
                    className="flex items-center justify-between w-full h-10 rounded-md border border-gray-300 shadow-sm px-3 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="flex items-center truncate">
                        <CalendarIcon className="mr-2 h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">
                            {getSelectedOptionText()}
                        </span>
                    </span>
                    <span className="ml-1 flex-shrink-0">
                        <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                            />
                        </svg>
                    </span>
                </button>

                {isOpen && (
                    <div className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <div
                            className="py-1"
                            role="menu"
                            aria-orientation="vertical"
                        >
                            {/* Quick option buttons */}
                            <div className="px-1">
                                {[
                                    { value: "Today", label: t("today") },
                                    {
                                        value: "Yesterday",
                                        label: t("yesterday"),
                                    },
                                    {
                                        value: "Last3Days",
                                        label: t("last3Days"),
                                    },
                                    {
                                        value: "Last7Days",
                                        label: t("last7Days"),
                                    },
                                    { value: "Custom", label: t("custom") },
                                ].map(option => (
                                    <button
                                        key={option.value}
                                        className={`${
                                            dateOption === option.value
                                                ? "bg-primary-50 text-primary-700"
                                                : "text-gray-700 hover:bg-gray-100"
                                        } block w-full px-3 py-2 text-left text-sm rounded-md mb-1`}
                                        onClick={() => {
                                            onDateOptionChange(
                                                option.value as DateFilterOption,
                                            );
                                            if (option.value !== "Custom") {
                                                setIsOpen(false);
                                            }
                                        }}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>

                            {/* Custom date inputs */}
                            {dateOption === "Custom" && (
                                <div className="px-3 py-2 border-t border-gray-100">
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                {t("startDate")}
                                            </label>
                                            <input
                                                type="date"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                value={formatDate(
                                                    customStartDate,
                                                )}
                                                onChange={e => {
                                                    const date = e.target.value
                                                        ? new Date(
                                                              e.target.value,
                                                          )
                                                        : null;
                                                    onCustomDateChange(
                                                        date,
                                                        customEndDate,
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700">
                                                {t("endDate")}
                                            </label>
                                            <input
                                                type="date"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                                                value={formatDate(
                                                    customEndDate,
                                                )}
                                                onChange={e => {
                                                    const date = e.target.value
                                                        ? new Date(
                                                              e.target.value,
                                                          )
                                                        : null;
                                                    onCustomDateChange(
                                                        customStartDate,
                                                        date,
                                                    );
                                                }}
                                            />
                                        </div>
                                        <div className="pt-2">
                                            <button
                                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:text-sm"
                                                onClick={() => setIsOpen(false)}
                                            >
                                                {t("apply")}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Display date range if custom is selected */}
            {dateOption === "Custom" &&
                !isOpen &&
                (customStartDate || customEndDate) && (
                    <div className="mt-1 text-xs text-gray-500">
                        {customStartDate && formatDate(customStartDate)}
                        {customStartDate && customEndDate && " ~ "}
                        {customEndDate && formatDate(customEndDate)}
                    </div>
                )}
        </div>
    );
}
