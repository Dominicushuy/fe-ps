// src/components/csv-manager/FilterTags.tsx

import React from "react";
import {
    XMarkIcon,
    NewspaperIcon,
    UserCircleIcon,
    TableCellsIcon,
} from "@heroicons/react/24/outline";
import { Media, MediaAccount, DataLayer } from "@/types";
import MediaLogo from "./MediaLogo";

interface FilterTagsProps {
    selectedMedia?: Media[];
    selectedAccounts: MediaAccount[];
    selectedDataLayers?: DataLayer[];
    onRemoveMedia?: (mediaId: string) => void;
    onRemoveAccount?: (accountId: string) => void;
    onRemoveDataLayer?: (layer: DataLayer) => void;
    limit?: number;
}

export default function FilterTags({
    selectedMedia = [],
    selectedAccounts,
    selectedDataLayers = [],
    onRemoveMedia,
    onRemoveAccount,
    onRemoveDataLayer,
    limit = 5, // Default to showing 5 of each type
}: FilterTagsProps) {
    // Don't render if there are no filters
    if (
        selectedMedia.length === 0 &&
        selectedAccounts.length === 0 &&
        selectedDataLayers.length === 0
    ) {
        return null;
    }

    // For each category, show up to 'limit' items and then a "+X more" tag
    const mediaToShow = selectedMedia.slice(0, limit);
    const accountsToShow = selectedAccounts.slice(0, limit);
    const dataLayersToShow = selectedDataLayers.slice(0, limit);

    const hasMoreMedia = selectedMedia.length > limit;
    const hasMoreAccounts = selectedAccounts.length > limit;

    return (
        <div className="flex flex-wrap gap-2 my-2">
            {/* Media tags */}
            {mediaToShow.map(media => (
                <span
                    key={`media-${media.id}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                    <NewspaperIcon className="h-3 w-3 mr-1" />
                    {media.name}
                    {onRemoveMedia && (
                        <button
                            type="button"
                            onClick={() => onRemoveMedia(media.id)}
                            className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                            <XMarkIcon className="h-3 w-3" />
                        </button>
                    )}
                </span>
            ))}

            {hasMoreMedia && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                    +{selectedMedia.length - limit} more
                </span>
            )}

            {/* Account tags */}
            {accountsToShow.map(account => (
                <span
                    key={`account-${account.id}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                >
                    <MediaLogo
                        logoPath={account.logoPath}
                        mediaName={account.mediaName}
                        size="xs"
                        className="mr-1"
                        fallbackIcon={
                            <UserCircleIcon className="h-3 w-3 text-green-600" />
                        }
                    />
                    {account.accountId}
                    {onRemoveAccount && (
                        <button
                            type="button"
                            onClick={() => onRemoveAccount(account.id)}
                            className="ml-1 text-green-600 hover:text-green-800"
                        >
                            <XMarkIcon className="h-3 w-3" />
                        </button>
                    )}
                </span>
            ))}

            {hasMoreAccounts && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                    +{selectedAccounts.length - limit} more
                </span>
            )}

            {/* Data layer tags */}
            {dataLayersToShow.map(layer => (
                <span
                    key={`layer-${layer}`}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                    <TableCellsIcon className="h-3 w-3 mr-1" />
                    {layer}
                    {onRemoveDataLayer && (
                        <button
                            type="button"
                            onClick={() => onRemoveDataLayer(layer)}
                            className="ml-1 text-purple-600 hover:text-purple-800"
                        >
                            <XMarkIcon className="h-3 w-3" />
                        </button>
                    )}
                </span>
            ))}
        </div>
    );
}
