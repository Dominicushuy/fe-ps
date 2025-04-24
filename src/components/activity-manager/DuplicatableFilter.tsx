// src/components/activity-manager/DuplicatableFilter.tsx
"use client";

import React from "react";
import { DocumentDuplicateIcon } from "@heroicons/react/24/outline";

interface DuplicatableFilterProps {
    isDuplicatable: boolean | null;
    onDuplicatableChange: (isDuplicatable: boolean | null) => void;
}

export default function DuplicatableFilter({
    isDuplicatable,
    onDuplicatableChange,
}: DuplicatableFilterProps) {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                重複可能フィルター (Duplicatable Filter)
            </label>
            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between">
                        <span className="flex items-center text-sm text-gray-700">
                            <DocumentDuplicateIcon className="h-5 w-5 text-gray-500 mr-2" />
                            重複可能 (Duplicatable)
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => onDuplicatableChange(null)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex-1 transition-colors ${
                                isDuplicatable === null
                                    ? "bg-gray-200 text-gray-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            すべて (All)
                        </button>
                        <button
                            type="button"
                            onClick={() => onDuplicatableChange(true)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex-1 transition-colors ${
                                isDuplicatable === true
                                    ? "bg-green-200 text-green-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            はい (Yes)
                        </button>
                        <button
                            type="button"
                            onClick={() => onDuplicatableChange(false)}
                            className={`px-3 py-1.5 text-sm font-medium rounded-md flex-1 transition-colors ${
                                isDuplicatable === false
                                    ? "bg-red-200 text-red-800"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            いいえ (No)
                        </button>
                    </div>
                </div>

                <div className="mt-2 text-xs text-gray-500">
                    {isDuplicatable === null
                        ? "すべての活動を表示 (Show all activities)"
                        : isDuplicatable
                        ? "重複可能な活動のみを表示 (Show only duplicatable activities)"
                        : "重複不可能な活動のみを表示 (Show only non-duplicatable activities)"}
                </div>
            </div>
        </div>
    );
}
