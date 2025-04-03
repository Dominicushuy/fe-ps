// src/components/csv-manager/DataLayerFilter.tsx

import React, { useEffect } from "react";
import { DataLayer } from "@/types";

interface DataLayerFilterProps {
    selectedLayers: DataLayer[];
    onLayerChange: (layers: DataLayer[]) => void;
    defaultSelectAll?: boolean; // New prop to select all by default
}

export default function DataLayerFilter({
    selectedLayers,
    onLayerChange,
    defaultSelectAll = false,
}: DataLayerFilterProps) {
    // Define the available data layers
    const dataLayers: {
        value: DataLayer;
        label: string;
        icon: React.ReactNode;
    }[] = [
        {
            value: "Campaign",
            label: "キャンペーン (Campaign)",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4z"
                    />
                </svg>
            ),
        },
        {
            value: "Adgroup",
            label: "広告グループ (Ad Group)",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
        },
        {
            value: "Ad",
            label: "広告 (Ad)",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                    />
                </svg>
            ),
        },
        {
            value: "Keyword",
            label: "キーワード (Keyword)",
            icon: (
                <svg
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                    />
                </svg>
            ),
        },
    ];

    // Initial select all if defaultSelectAll is true and selectedLayers is empty
    useEffect(() => {
        if (defaultSelectAll && selectedLayers.length === 0) {
            onLayerChange(dataLayers.map(layer => layer.value));
        }
    }, [defaultSelectAll, selectedLayers.length, onLayerChange]);

    // Toggle a data layer
    const toggleLayer = (layer: DataLayer) => {
        const isSelected = selectedLayers.includes(layer);

        if (isSelected) {
            onLayerChange(selectedLayers.filter(l => l !== layer));
        } else {
            onLayerChange([...selectedLayers, layer]);
        }
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dataLayers.map(layer => {
                    const isSelected = selectedLayers.includes(layer.value);

                    return (
                        <button
                            key={layer.value}
                            type="button"
                            onClick={() => toggleLayer(layer.value)}
                            className={`
                flex items-center p-3 rounded-lg border shadow-sm transition-all
                ${
                    isSelected
                        ? "bg-primary-50 border-primary-300 text-primary-700 ring-2 ring-primary-200"
                        : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
                }
              `}
                        >
                            <span
                                className={`mr-2 ${
                                    isSelected
                                        ? "text-primary-600"
                                        : "text-gray-400"
                                }`}
                            >
                                {layer.icon}
                            </span>
                            <span className="text-sm font-medium">
                                {layer.value}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Display selected layers */}
            <div className="mt-2 text-xs text-gray-500">
                {selectedLayers.length === 0
                    ? "データ層が選択されていません (No data layers selected)"
                    : selectedLayers.length === dataLayers.length
                    ? "すべてのデータ層が選択されています (All data layers selected)"
                    : `選択された層: ${selectedLayers.join(
                          ", ",
                      )} (Selected layers: ${selectedLayers.join(", ")})`}
            </div>
        </div>
    );
}
