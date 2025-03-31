"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface SearchBarProps {
    searchTerm: string;
    onSearch: (searchTerm: string) => void;
    placeholder?: string;
    debounceMs?: number;
}

export default function SearchBar({
    searchTerm,
    onSearch,
    placeholder = "検索... (Search...)",
    debounceMs = 300,
}: SearchBarProps) {
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Sync với external state
    useEffect(() => {
        setLocalSearchTerm(searchTerm);
    }, [searchTerm]);

    // Hàm debounce để tìm kiếm sau khi người dùng dừng gõ
    const debouncedSearch = useCallback(
        (value: string) => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            debounceTimerRef.current = setTimeout(() => {
                onSearch(value);
            }, debounceMs);
        },
        [onSearch, debounceMs],
    );

    // Handler cho việc thay đổi giá trị tìm kiếm
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocalSearchTerm(value);
        debouncedSearch(value);
    };

    // Xóa giá trị tìm kiếm
    const handleClear = () => {
        setLocalSearchTerm("");
        onSearch("");
        if (searchInputRef.current) {
            searchInputRef.current.focus();
        }
    };

    // Xử lý khi Enter được nhấn
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
            onSearch(localSearchTerm);
        }
    };

    // Cleanup when component unmounts
    useEffect(() => {
        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="relative w-full md:w-64 lg:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-500"
                    aria-hidden="true"
                />
            </div>

            <input
                ref={searchInputRef}
                type="text"
                value={localSearchTerm}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                className="  
                    block w-full   
                    rounded-md   
                    border border-gray-300   
                    pl-10 pr-10 py-2   
                    focus:outline-none   
                    focus:ring-2   
                    focus:ring-blue-500   
                    focus:border-blue-500   
                    text-sm  
                "
                placeholder={placeholder}
                aria-label="Search through all columns"
            />

            {localSearchTerm && (
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 z-10">
                    <button
                        type="button"
                        onClick={handleClear}
                        className="  
                            text-gray-400   
                            hover:text-gray-600   
                            focus:outline-none  
                        "
                        aria-label="Clear search"
                    >
                        <XCircleIcon className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>
            )}
        </div>
    );
}
