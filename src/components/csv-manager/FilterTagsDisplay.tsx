// src/components/csv-manager/FilterTagsDisplay.tsx

import React from "react";
import { FunnelIcon } from "@heroicons/react/24/outline";
import { MediaAccount, ColumnFilter } from "@/types";

interface FilterTagsDisplayProps {
    selectedAccounts: MediaAccount[];
    filters: ColumnFilter[];
    onClearFilters: () => void;
}

/**
 * Component to display applied filters as a summary
 */
const FilterTagsDisplay: React.FC<FilterTagsDisplayProps> = ({
    selectedAccounts,
    filters,
    onClearFilters,
}) => {
    // Only render if there are any filters applied
    if (selectedAccounts.length === 0 && filters.length === 0) {
        return null;
    }

    return (
        <div className="mb-5 bg-blue-50 p-3 rounded-lg border border-blue-100">
            <h4 className="text-sm font-medium text-blue-700 mb-2">
                適用フィルター (Applied Filters)
            </h4>

            {/* Account tags */}
            {selectedAccounts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {selectedAccounts.slice(0, 5).map(account => (
                        <span
                            key={account.id}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                        >
                            {account.accountId} - {account.name}
                        </span>
                    ))}

                    {/* Show count if there are more than 5 accounts */}
                    {selectedAccounts.length > 5 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                            +{selectedAccounts.length - 5} more
                        </span>
                    )}
                </div>
            )}

            {/* Advanced filters */}
            {filters.length > 0 && (
                <div className="flex items-center">
                    <FunnelIcon className="h-4 w-4 text-blue-600 mr-1" />
                    <span className="text-xs font-medium text-blue-700">
                        Advanced filters: {filters.length}
                    </span>
                    <button
                        onClick={onClearFilters}
                        className="ml-2 text-xs text-red-600 hover:text-red-800"
                    >
                        クリア (Clear)
                    </button>
                </div>
            )}
        </div>
    );
};

export default FilterTagsDisplay;
