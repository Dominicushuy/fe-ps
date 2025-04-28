// /components/activity-manager/TypeFilter.tsx

"use client";

import React from "react";
import {
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { ActivityType } from "@/types/activity-types";
import { useTranslations } from "next-intl";

interface TypeFilterProps {
    selectedType: ActivityType | "All";
    onTypeChange: (type: ActivityType | "All") => void;
}

export default function TypeFilter({
    selectedType,
    onTypeChange,
}: TypeFilterProps) {
    const t = useTranslations();

    // Define button styles for consistency
    const getButtonStyle = (
        isActive: boolean,
        isFirst: boolean,
        isLast: boolean,
    ) => {
        let className =
            "relative flex-1 h-10 flex items-center justify-center text-xs font-medium ";

        // Border radius
        if (isFirst) className += "rounded-l-md ";
        if (isLast) className += "rounded-r-md ";

        // Colors
        if (isActive) {
            className +=
                "bg-primary-600 text-white border border-primary-600 z-10 ";
        } else {
            className +=
                "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 ";
        }

        // Focus styles
        className +=
            "focus:outline-none focus:ring-1 focus:ring-primary-500 focus:border-primary-500";

        return className;
    };

    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {t("typeFilter")}
            </label>
            <div className="flex shadow-sm">
                <button
                    type="button"
                    className={getButtonStyle(
                        selectedType === "All",
                        true,
                        false,
                    )}
                    onClick={() => onTypeChange("All")}
                >
                    {t("all")}
                </button>
                <button
                    type="button"
                    className={getButtonStyle(
                        selectedType === "Download",
                        false,
                        false,
                    )}
                    onClick={() => onTypeChange("Download")}
                >
                    <ArrowDownTrayIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{t("download")}</span>
                </button>
                <button
                    type="button"
                    className={getButtonStyle(
                        selectedType === "Upload",
                        false,
                        true,
                    )}
                    onClick={() => onTypeChange("Upload")}
                >
                    <ArrowUpTrayIcon className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
                    <span className="truncate">{t("upload")}</span>
                </button>
            </div>
        </div>
    );
}
