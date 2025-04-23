// src/components/csv-manager/EnhancedAccountFilter.tsx

import React, { useState, useMemo } from "react";
import {
    MagnifyingGlassIcon,
    XMarkIcon,
    UserCircleIcon,
    ArrowRightIcon,
    ArrowLeftIcon,
    NewspaperIcon,
} from "@heroicons/react/24/outline";
import { MediaAccount } from "@/types";
import { useClientAccounts } from "@/hooks/useClientAccounts";
import MediaLogo from "./MediaLogo";

interface EnhancedAccountFilterProps {
    clientId: string | null;
    selectedAccounts: MediaAccount[];
    onAccountChange: (selectedAccounts: MediaAccount[]) => void;
}

export default function EnhancedAccountFilter({
    clientId,
    selectedAccounts,
    onAccountChange,
}: EnhancedAccountFilterProps) {
    const [availableSearchTerm, setAvailableSearchTerm] = useState("");
    const [selectedSearchTerm, setSelectedSearchTerm] = useState("");

    // Use the custom hook to fetch accounts for the selected client
    const { accounts: allAccounts, isLoading } = useClientAccounts({
        clientId,
        limit: 500, // Get a large number of accounts
        enabled: !!clientId,
    });

    // Create a list of available accounts (filtered by search and not already selected)
    const availableAccounts = useMemo(() => {
        // Filter out already selected accounts
        const notSelectedAccounts = allAccounts.filter(
            account => !selectedAccounts.some(a => a.id === account.id),
        );

        // Apply search filter if available
        if (!availableSearchTerm) return notSelectedAccounts;

        const lowerCaseSearch = availableSearchTerm.toLowerCase();
        return notSelectedAccounts.filter(
            account =>
                // Search by account ID
                account.accountId.toLowerCase().includes(lowerCaseSearch) ||
                // Search by account name
                account.name.toLowerCase().includes(lowerCaseSearch) ||
                // Search by media ID
                account.mediaId.toLowerCase().includes(lowerCaseSearch) ||
                // Search by media name
                account.mediaName.toLowerCase().includes(lowerCaseSearch),
        );
    }, [allAccounts, selectedAccounts, availableSearchTerm]);

    // Create a list of selected accounts (filtered by search term)
    const filteredSelectedAccounts = useMemo(() => {
        if (!selectedSearchTerm) return selectedAccounts;

        const lowerCaseSearch = selectedSearchTerm.toLowerCase();
        return selectedAccounts.filter(
            account =>
                // Search by account ID
                account.accountId.toLowerCase().includes(lowerCaseSearch) ||
                // Search by account name
                account.name.toLowerCase().includes(lowerCaseSearch) ||
                // Search by media ID
                account.mediaId.toLowerCase().includes(lowerCaseSearch) ||
                // Search by media name
                account.mediaName.toLowerCase().includes(lowerCaseSearch),
        );
    }, [selectedAccounts, selectedSearchTerm]);

    // Select a single account
    const selectAccount = (account: MediaAccount) => {
        onAccountChange([...selectedAccounts, account]);
    };

    // Deselect a single account
    const deselectAccount = (account: MediaAccount) => {
        onAccountChange(selectedAccounts.filter(a => a.id !== account.id));
    };

    // Select all filtered available accounts
    const selectAllFiltered = () => {
        onAccountChange([...selectedAccounts, ...availableAccounts]);
    };

    // Deselect all filtered selected accounts
    const deselectAllFiltered = () => {
        const idsToRemove = new Set(filteredSelectedAccounts.map(a => a.id));
        onAccountChange(selectedAccounts.filter(a => !idsToRemove.has(a.id)));
    };

    return (
        <div className="w-full">
            {/* Selection stats */}
            <div className="mb-2 text-xs text-gray-600">
                {selectedAccounts.length} / {allAccounts.length}{" "}
                アカウントが選択されました
            </div>

            {/* Selection interface with two cards */}
            <div className="flex flex-col lg:flex-row gap-4">
                {/* Available accounts card */}
                <div className="flex-1 border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-gray-50 p-2 border-b border-gray-200 rounded-t-lg">
                        <h3 className="text-sm font-medium text-gray-700">
                            利用可能なアカウント (Available Accounts)
                        </h3>

                        {/* Search input for available accounts */}
                        <div className="mt-2 relative">
                            <input
                                type="text"
                                className="block w-full pr-10 pl-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="アカウント/メディアを検索... (Search accounts/media...)"
                                value={availableSearchTerm}
                                onChange={e =>
                                    setAvailableSearchTerm(e.target.value)
                                }
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            {availableSearchTerm && (
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setAvailableSearchTerm("")}
                                >
                                    <XMarkIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Actions for available accounts */}
                        {availableAccounts.length > 0 && (
                            <div className="mt-2 flex justify-between">
                                <span className="text-xs text-gray-500">
                                    {availableAccounts.length} アカウント表示中
                                </span>
                                <button
                                    type="button"
                                    className="text-xs text-primary-600 hover:text-primary-800"
                                    onClick={selectAllFiltered}
                                >
                                    すべて選択 (Select All)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Available accounts list */}
                    <div className="p-2 h-64 overflow-y-auto">
                        {isLoading ? (
                            <div className="py-4 text-center">
                                <svg
                                    className="animate-spin h-5 w-5 text-primary-600 mx-auto"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <p className="mt-2 text-sm text-gray-500">
                                    ロード中... (Loading...)
                                </p>
                            </div>
                        ) : availableAccounts.length === 0 ? (
                            <div className="py-2 px-3 text-sm text-gray-500 italic text-center">
                                {availableSearchTerm
                                    ? "検索結果はありません (No search results)"
                                    : clientId
                                    ? "利用可能なアカウントはありません (No available accounts)"
                                    : "クライアントを選択してください (Please select a client)"}
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {availableAccounts.map(account => (
                                    <li key={account.id} className="py-2 px-1">
                                        {/* Make the entire row clickable with hover effect */}
                                        <div
                                            className="flex justify-between items-center rounded-md hover:bg-gray-100 cursor-pointer transition-colors p-1 group"
                                            onClick={() =>
                                                selectAccount(account)
                                            }
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    {/* Replace UserCircleIcon with MediaLogo */}
                                                    <MediaLogo
                                                        logoPath={
                                                            account.logoPath
                                                        }
                                                        mediaName={
                                                            account.mediaName
                                                        }
                                                        size="md" // Use md size (w-6 h-6) instead of sm
                                                        className="mr-2"
                                                        fallbackIcon={
                                                            <UserCircleIcon className="h-6 w-6 text-gray-400" />
                                                        }
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-700">
                                                            {account.accountId}{" "}
                                                            - {account.name}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center">
                                                            <NewspaperIcon className="h-3 w-3 mr-1" />
                                                            <span>
                                                                {
                                                                    account.mediaName
                                                                }{" "}
                                                                (ID:{" "}
                                                                {
                                                                    account.mediaId
                                                                }
                                                                )
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Keep the explicit button for users who prefer to click it directly */}
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation(); // Prevent triggering the parent onClick
                                                    selectAccount(account);
                                                }}
                                                className="ml-2 flex-shrink-0 p-1 rounded-full text-primary-600 hover:bg-primary-100 group-hover:bg-primary-100 group-hover:text-primary-700"
                                                title="選択 (Select)"
                                            >
                                                <ArrowRightIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Selected accounts card */}
                <div className="flex-1 border border-gray-200 rounded-lg shadow-sm">
                    <div className="bg-primary-50 p-2 border-b border-primary-200 rounded-t-lg">
                        <h3 className="text-sm font-medium text-primary-700">
                            選択されたアカウント (Selected Accounts)
                        </h3>

                        {/* Search input for selected accounts */}
                        <div className="mt-2 relative">
                            <input
                                type="text"
                                className="block w-full pr-10 pl-10 py-2 text-sm border-gray-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                                placeholder="選択されたアカウントを検索... (Search selected...)"
                                value={selectedSearchTerm}
                                onChange={e =>
                                    setSelectedSearchTerm(e.target.value)
                                }
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                            </div>
                            {selectedSearchTerm && (
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setSelectedSearchTerm("")}
                                >
                                    <XMarkIcon className="h-5 w-5 text-gray-400" />
                                </button>
                            )}
                        </div>

                        {/* Actions for selected accounts */}
                        {filteredSelectedAccounts.length > 0 && (
                            <div className="mt-2 flex justify-between">
                                <span className="text-xs text-gray-500">
                                    {filteredSelectedAccounts.length}{" "}
                                    アカウント選択済み
                                </span>
                                <button
                                    type="button"
                                    className="text-xs text-red-600 hover:text-red-800"
                                    onClick={deselectAllFiltered}
                                >
                                    すべて削除 (Remove All)
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Selected accounts list */}
                    <div className="p-2 h-64 overflow-y-auto">
                        {filteredSelectedAccounts.length === 0 ? (
                            <div className="py-2 px-3 text-sm text-gray-500 italic text-center">
                                {selectedSearchTerm
                                    ? "検索結果はありません (No search results)"
                                    : "アカウントが選択されていません (No accounts selected)"}
                            </div>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {filteredSelectedAccounts.map(account => (
                                    <li key={account.id} className="py-2 px-1">
                                        {/* Make the entire row clickable with hover effect */}
                                        <div
                                            className="flex justify-between items-center rounded-md hover:bg-primary-100 cursor-pointer transition-colors p-1 group"
                                            onClick={() =>
                                                deselectAccount(account)
                                            }
                                        >
                                            {/* Keep the explicit button for users who prefer to click it directly */}
                                            <button
                                                type="button"
                                                onClick={e => {
                                                    e.stopPropagation(); // Prevent triggering the parent onClick
                                                    deselectAccount(account);
                                                }}
                                                className="mr-2 flex-shrink-0 p-1 rounded-full text-red-600 hover:bg-red-100 group-hover:bg-red-100 group-hover:text-red-700"
                                                title="削除 (Remove)"
                                            >
                                                <ArrowLeftIcon className="h-5 w-5" />
                                            </button>
                                            <div className="flex-1">
                                                <div className="flex items-center">
                                                    {/* Replace UserCircleIcon with MediaLogo */}
                                                    <MediaLogo
                                                        logoPath={
                                                            account.logoPath
                                                        }
                                                        mediaName={
                                                            account.mediaName
                                                        }
                                                        size="md" // Use md size (w-6 h-6) instead of sm
                                                        className="mr-2"
                                                        fallbackIcon={
                                                            <UserCircleIcon className="h-6 w-6 text-primary-400" />
                                                        }
                                                    />
                                                    <div>
                                                        <p className="text-sm font-medium text-primary-700">
                                                            {account.accountId}{" "}
                                                            - {account.name}
                                                        </p>
                                                        <p className="text-xs text-primary-500 flex items-center">
                                                            <NewspaperIcon className="h-3 w-3 mr-1" />
                                                            <span>
                                                                {
                                                                    account.mediaName
                                                                }{" "}
                                                                (ID:{" "}
                                                                {
                                                                    account.mediaId
                                                                }
                                                                )
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
