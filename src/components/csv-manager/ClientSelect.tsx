import React, { useState, useEffect } from "react";
import Select from "react-select";
import { useDebounce } from "use-debounce";
import { Client } from "@/types";
import { fetchClients } from "@/lib/api/client";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { XMarkIcon } from "@heroicons/react/24/outline"; // Import XMarkIcon

interface ClientSelectProps {
    selectedClient: Client | null;
    onClientSelect: (client: Client | null) => void;
    disabled?: boolean;
}

// Define type for options
interface ClientOption {
    value: string;
    label: string;
    client: Client;
}

export default function ClientSelect({
    selectedClient,
    onClientSelect,
    disabled = false,
}: ClientSelectProps) {
    // State to store input search value
    const [inputValue, setInputValue] = useState("");
    // Debounce search (500ms)
    const [debouncedInputValue] = useDebounce(inputValue, 500);
    // State to store options list
    const [options, setOptions] = useState<ClientOption[]>([]);
    // State to control loading status
    const [isLoading, setIsLoading] = useState(false);

    // Load clients list when input changes
    useEffect(() => {
        const loadClients = async () => {
            setIsLoading(true);
            try {
                const response = await fetchClients({
                    search: debouncedInputValue,
                    limit: 20,
                });

                const clientOptions = response.results.map(client => ({
                    value: client.client_id,
                    label: `${client.client_id} - ${client.client_name}`,
                    client: {
                        id: client.client_id,
                        accountId: client.client_id,
                        name: client.client_name,
                    } as Client,
                }));

                setOptions(clientOptions);
            } catch (error) {
                console.error("Error loading clients:", error);
                setOptions([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadClients();
    }, [debouncedInputValue]);

    // Convert selected client to option format
    const selectedOption = selectedClient
        ? {
              value: selectedClient.id,
              label: `${selectedClient.accountId} - ${selectedClient.name}`,
              client: selectedClient,
          }
        : null;

    return (
        <div className="w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                選択クライアント (Select Client)
            </label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 z-10 pointer-events-none">
                    <UserCircleIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                    />
                </div>
                <Select
                    value={selectedOption}
                    onChange={(option: ClientOption | null) => {
                        onClientSelect(option ? option.client : null);
                    }}
                    options={options}
                    isDisabled={disabled}
                    isLoading={isLoading}
                    isClearable
                    placeholder="アカウントIDで検索 (Search by Account ID)"
                    loadingMessage={() => "ロード中... (Loading...)"}
                    noOptionsMessage={() =>
                        "検索結果がありません (No results found)"
                    }
                    // Control input value
                    inputValue={inputValue}
                    onInputChange={(newValue, actionMeta) => {
                        // Only update when user actually types or deletes content
                        if (actionMeta.action === "input-change") {
                            setInputValue(newValue);
                        }
                    }}
                    // Other options
                    className={`select-component ${
                        selectedClient ? "has-value" : ""
                    }`}
                    classNamePrefix="select"
                />
            </div>

            {/* CSS styles for select */}
            <style jsx global>{`
                .select-component .select__control {
                    padding: 0.375rem 0.75rem 0.375rem 2.5rem;
                    border-radius: 0.375rem;
                }
                .select-component.has-value .select__control {
                    border-color: #4f46e5;
                    box-shadow: 0 0 0 1px #4f46e5;
                }
                .select-component .select__control:hover {
                    border-color: ${selectedClient ? "#4f46e5" : "#d1d5db"};
                }
                .select-component .select__menu {
                    z-index: 50;
                }
                .select-component .select__indicator-separator {
                    display: none;
                }
                .clear-button {
                    transition: all 0.2s;
                }
                .clear-button:hover {
                    background-color: #e5e7eb;
                }
            `}</style>

            {/* Display selected client information */}
            {selectedClient && (
                <div className="mt-2 p-3 bg-primary-50 rounded-md border border-primary-200 relative">
                    {/* Clear button */}
                    <button
                        className="absolute top-2 right-2 p-1 rounded-full clear-button hover:bg-gray-200 transition-colors"
                        onClick={() => onClientSelect(null)}
                        disabled={disabled}
                        title="Clear selection"
                        aria-label="Clear selection"
                    >
                        <XMarkIcon className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                    </button>

                    <p className="text-sm font-medium text-gray-700">
                        選択されたクライアント (Selected Client):
                    </p>
                    <div className="mt-1 flex items-center">
                        <UserCircleIcon className="h-5 w-5 text-primary-600 mr-2" />
                        <p className="text-sm text-primary-800">
                            <span className="font-semibold">
                                {selectedClient.accountId}
                            </span>{" "}
                            - {selectedClient.name}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
