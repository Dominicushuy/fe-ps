// /components/activity-manager/ActivityTable.tsx

"use client";

import React, { useMemo, useState } from "react";
import { Activity } from "@/types/activity-types";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/24/solid";
import {
    CheckCircleIcon,
    ClockIcon,
    ExclamationCircleIcon,
    ArrowDownTrayIcon,
    ArrowUpTrayIcon,
    DocumentArrowDownIcon,
    ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

interface ActivityTableProps {
    activities: Activity[];
}

export default function ActivityTable({ activities }: ActivityTableProps) {
    const [sortConfig, setSortConfig] = useState<{
        key: keyof Activity | "client.name" | null;
        direction: "ascending" | "descending";
    }>({
        key: "startTime",
        direction: "descending",
    });

    // Sorting function
    const sortedActivities = useMemo(() => {
        const sortableActivities = [...activities];
        if (sortConfig.key) {
            sortableActivities.sort((a: Activity, b: Activity) => {
                if (sortConfig.key === "client.name") {
                    // Sort by client name
                    if (a.client.name < b.client.name) {
                        return sortConfig.direction === "ascending" ? -1 : 1;
                    }
                    if (a.client.name > b.client.name) {
                        return sortConfig.direction === "ascending" ? 1 : -1;
                    }
                    return 0;
                } else if (
                    sortConfig.key === "startTime" ||
                    sortConfig.key === "endTime"
                ) {
                    // Handle null endTime
                    const aValue =
                        sortConfig.key === "endTime" && a.endTime === null
                            ? new Date(0)
                            : (a[sortConfig.key] as Date);
                    const bValue =
                        sortConfig.key === "endTime" && b.endTime === null
                            ? new Date(0)
                            : (b[sortConfig.key] as Date);

                    if ((aValue ?? new Date(0)) < (bValue ?? new Date(0))) {
                        return sortConfig.direction === "ascending" ? -1 : 1;
                    }
                    if ((aValue ?? new Date(0)) > (bValue ?? new Date(0))) {
                        return sortConfig.direction === "ascending" ? 1 : -1;
                    }
                    return 0;
                } else {
                    // Sort standard string/number fields
                    const aValue = a[sortConfig.key as keyof Activity] ?? "";
                    const bValue = b[sortConfig.key as keyof Activity] ?? "";

                    if (aValue < bValue) {
                        return sortConfig.direction === "ascending" ? -1 : 1;
                    }
                    if (aValue > bValue) {
                        return sortConfig.direction === "ascending" ? 1 : -1;
                    }
                    return 0;
                }
            });
        }
        return sortableActivities;
    }, [activities, sortConfig]);

    // Sort handler
    const requestSort = (key: keyof Activity | "client.name") => {
        let direction: "ascending" | "descending" = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    // Format date
    const formatDate = (date: Date | null) => {
        if (!date) return "N/A";
        return new Intl.DateTimeFormat("ja-JP", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }).format(date);
    };

    // Render status with icon
    const renderStatus = (status: string) => {
        switch (status) {
            case "Success":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        <CheckCircleIcon className="mr-1 h-4 w-4 text-green-500" />
                        成功
                    </span>
                );
            case "Processing":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <ClockIcon className="mr-1 h-4 w-4 text-blue-500 animate-spin" />
                        処理中
                    </span>
                );
            case "Failed":
                return (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <ExclamationCircleIcon className="mr-1 h-4 w-4 text-red-500" />
                        失敗
                    </span>
                );
            default:
                return status;
        }
    };

    // Handle download button click
    const handleDownload = (activity: Activity) => {
        if (!activity.s3Link) {
            alert('ダウンロードリンクが利用できません。(Download link unavailable.)');
            return;
        }
        
        // In a real application, this would trigger the download process
        console.log(`Downloading from S3: ${activity.s3Link}`);
        
        // Create a temporary anchor element to trigger download
        const a = document.createElement('a');
        a.href = activity.s3Link;
        a.download = activity.filename || `file-${activity.id}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // No data message
    if (activities.length === 0) {
        return (
            <div className="text-center py-10 border rounded-lg">
                <p className="text-gray-500">
                    アクティビティがありません (No activities available)
                </p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
                <div className="overflow-hidden shadow-md ring-1 ring-black ring-opacity-5 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-primary-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("startTime")}
                                >
                                    <div className="group flex items-center">
                                        <span>Start Time</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key === "startTime" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("endTime")}
                                >
                                    <div className="group flex items-center">
                                        <span>End Time</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key === "endTime" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("client.name")}
                                >
                                    <div className="group flex items-center">
                                        <span>Client</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key ===
                                            "client.name" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("type")}
                                >
                                    <div className="group flex items-center">
                                        <span>Type</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key === "type" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("status")}
                                >
                                    <div className="group flex items-center">
                                        <span>Status</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key === "status" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("user")}
                                >
                                    <div className="group flex items-center">
                                        <span>User</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key === "user" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                {/* File Name column */}
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900 cursor-pointer hover:bg-primary-100 transition-colors"
                                    onClick={() => requestSort("filename" as any)}
                                >
                                    <div className="group flex items-center">
                                        <span>File</span>
                                        <span className="ml-2 flex-none rounded text-primary-500">
                                            {sortConfig.key === "filename" ? (
                                                sortConfig.direction ===
                                                "ascending" ? (
                                                    <ChevronUpIcon className="h-4 w-4" />
                                                ) : (
                                                    <ChevronDownIcon className="h-4 w-4" />
                                                )
                                            ) : (
                                                <div className="h-4 w-4" />
                                            )}
                                        </span>
                                    </div>
                                </th>
                                {/* Actions column */}
                                <th
                                    scope="col"
                                    className="px-3 py-3.5 text-left text-sm font-semibold text-primary-900"
                                >
                                    <div className="group flex items-center">
                                        <span>Actions</span>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {sortedActivities.map((activity, index) => (
                                <tr
                                    key={activity.id}
                                    className={
                                        index % 2 === 0
                                            ? "bg-white hover:bg-gray-50"
                                            : "bg-gray-50 hover:bg-gray-100"
                                    }
                                >
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {formatDate(activity.startTime)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {formatDate(activity.endTime)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">
                                                {activity.client.accountId}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {activity.client.name}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {activity.type === "Download" ? (
                                            <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-600/20">
                                                <ArrowDownTrayIcon className="h-3 w-3 mr-1" />
                                                ダウンロード
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-600/20">
                                                <ArrowUpTrayIcon className="h-3 w-3 mr-1" />
                                                アップロード
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                                        {renderStatus(activity.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {activity.user}
                                    </td>
                                    {/* File name cell */}
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {activity.type === "Download" && activity.filename ? (
                                            <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded truncate max-w-[150px] inline-block">
                                                {activity.filename}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    {/* Actions cell */}
                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                                        {activity.type === "Download" && activity.status === "Success" ? (
                                            activity.s3Link ? (
                                                <button
                                                    onClick={() => handleDownload(activity)}
                                                    className="inline-flex items-center rounded-md bg-primary-50 px-2.5 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1 transition-colors"
                                                    title="ファイルをダウンロード (Download file)"
                                                >
                                                    <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                                                    ダウンロード
                                                </button>
                                            ) : (
                                                <span className="inline-flex items-center text-xs text-amber-600">
                                                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                                    リンク切れ
                                                </span>
                                            )
                                        ) : activity.type === "Download" && activity.status === "Failed" ? (
                                            <button
                                                onClick={() => alert('処理に失敗しました。後でもう一度お試しください。(The process failed. Please try again later.)')}
                                                className="inline-flex items-center rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1 transition-colors"
                                                title="ダウンロードを再試行 (Retry download)"
                                            >
                                                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                                                再試行
                                            </button>
                                        ) : activity.type === "Download" && activity.status === "Processing" ? (
                                            <span className="inline-flex items-center text-xs text-blue-500">
                                                <ClockIcon className="h-4 w-4 mr-1 animate-spin" />
                                                処理中...
                                            </span>
                                        ) : (
                                            <span className="text-gray-400 text-xs">-</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}