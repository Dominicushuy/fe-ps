import React, { useEffect } from "react";
import { useTranslations } from "next-intl";
import { DataLayer, DataLayerUIOption } from "@/types";

interface DataLayerFilterProps {
    selectedLayers: DataLayer[];
    onLayerChange: (layers: DataLayer[]) => void;
    defaultSelectAll?: boolean;
}

export default function DataLayerFilter({
    selectedLayers,
    onLayerChange,
    defaultSelectAll = false,
}: DataLayerFilterProps) {
    const t = useTranslations();

    // Define the available data layers for UI display
    const dataLayerOptions: {
        value: DataLayerUIOption;
        label: string;
        icon: React.ReactNode;
    }[] = [
        {
            value: "campaign",
            label: t("campaign"),
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
            value: "ad_group",
            label: t("adGroup"),
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
            value: "ad",
            label: t("ad"),
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
            value: "keyword",
            label: t("keyword"),
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

    // Helper function to check if a layer is selected
    const isLayerSelected = (layer: DataLayerUIOption): boolean => {
        if (layer === "campaign" || layer === "ad_group") {
            // Direct match for campaign or ad_group
            return selectedLayers.includes(layer);
        } else if (layer === "ad") {
            // Ad is selected if either "ad" or "ad_and_keyword" is in the selectedLayers
            return (
                selectedLayers.includes("ad") ||
                selectedLayers.includes("ad_and_keyword")
            );
        } else if (layer === "keyword") {
            // Keyword is selected if either "keyword" or "ad_and_keyword" is in the selectedLayers
            return (
                selectedLayers.includes("keyword") ||
                selectedLayers.includes("ad_and_keyword")
            );
        }
        return false;
    };

    // Function to handle selection/deselection of a layer with the new logic
    const handleLayerToggle = (layer: DataLayerUIOption) => {
        let newLayers: DataLayer[] = [...selectedLayers];

        if (layer === "campaign" || layer === "ad_group") {
            // If selecting a campaign-level option, clear any ad/keyword selections
            if (!isLayerSelected(layer)) {
                // Remove all ad/keyword level selections
                newLayers = newLayers.filter(
                    l =>
                        l !== "ad" && l !== "keyword" && l !== "ad_and_keyword",
                );

                // Remove other campaign-level option if any
                newLayers = newLayers.filter(
                    l => l !== "campaign" && l !== "ad_group",
                );

                // Add the selected campaign-level option
                newLayers.push(layer);
            } else {
                // Just deselect this layer if it's already selected
                newLayers = newLayers.filter(l => l !== layer);
            }
        } else if (layer === "ad" || layer === "keyword") {
            // If selecting an ad/keyword-level option, clear any campaign-level selections
            if (!isLayerSelected(layer)) {
                // Remove all campaign-level selections
                newLayers = newLayers.filter(
                    l => l !== "campaign" && l !== "ad_group",
                );

                const adSelected = isLayerSelected("ad");
                const keywordSelected = isLayerSelected("keyword");

                if (layer === "ad") {
                    if (keywordSelected) {
                        // If keyword is already selected, add ad_and_keyword instead
                        newLayers = newLayers.filter(
                            l => l !== "keyword" && l !== "ad_and_keyword",
                        );
                        newLayers.push("ad_and_keyword");
                    } else {
                        // Just add ad
                        newLayers.push("ad");
                    }
                } else {
                    // layer === "keyword"
                    if (adSelected) {
                        // If ad is already selected, add ad_and_keyword instead
                        newLayers = newLayers.filter(
                            l => l !== "ad" && l !== "ad_and_keyword",
                        );
                        newLayers.push("ad_and_keyword");
                    } else {
                        // Just add keyword
                        newLayers.push("keyword");
                    }
                }
            } else {
                // Deselecting an already selected option
                if (layer === "ad") {
                    if (selectedLayers.includes("ad_and_keyword")) {
                        // If ad_and_keyword is selected, replace with just keyword
                        newLayers = newLayers.filter(
                            l => l !== "ad_and_keyword",
                        );
                        newLayers.push("keyword");
                    } else {
                        // Just remove ad
                        newLayers = newLayers.filter(l => l !== "ad");
                    }
                } else {
                    // layer === "keyword"
                    if (selectedLayers.includes("ad_and_keyword")) {
                        // If ad_and_keyword is selected, replace with just ad
                        newLayers = newLayers.filter(
                            l => l !== "ad_and_keyword",
                        );
                        newLayers.push("ad");
                    } else {
                        // Just remove keyword
                        newLayers = newLayers.filter(l => l !== "keyword");
                    }
                }
            }
        }

        onLayerChange(newLayers);
    };

    // Only initialize default selection if defaultSelectAll is true and selectedLayers is empty
    // This useEffect is kept but won't do anything by default anymore since defaultSelectAll is now false
    useEffect(() => {
        if (defaultSelectAll && selectedLayers.length === 0) {
            // Default selection: campaign only
            onLayerChange(["campaign"]);
        }
    }, [defaultSelectAll, selectedLayers.length, onLayerChange]);

    // Helper to get display name for a layer
    const getDisplayName = (layer: DataLayer): string => {
        if (layer === "ad_group") return t("adGroup");
        if (layer === "ad_and_keyword") return t("adAndKeyword");
        return t(layer);
    };

    return (
        <div className="w-full">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {dataLayerOptions.map(layer => {
                    const isSelected = isLayerSelected(layer.value);

                    return (
                        <button
                            key={layer.value}
                            type="button"
                            onClick={() => handleLayerToggle(layer.value)}
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
                                {layer.label}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Display selected layers */}
            <div className="mt-2 text-xs text-gray-500">
                {selectedLayers.length === 0
                    ? t("noDataLayersSelected")
                    : t("selectedLayers", {
                          "0": selectedLayers.map(getDisplayName).join(", "),
                      })}
            </div>
        </div>
    );
}
