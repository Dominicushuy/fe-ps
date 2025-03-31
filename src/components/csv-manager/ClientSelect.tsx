"use client";

import React, { Fragment, useState, useEffect, useRef } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { UserCircleIcon } from "@heroicons/react/24/outline";
import { Client } from "@/types";
import { mockClients } from "@/data/mock-clients";

interface ClientSelectProps {
    selectedClient: Client | null;
    onClientSelect: (client: Client | null) => void;
    disabled?: boolean;
}

export default function ClientSelect({
    selectedClient,
    onClientSelect,
    disabled = false,
}: ClientSelectProps) {
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const comboboxRef = useRef<HTMLDivElement>(null);

    // Mock clients (thực tế sẽ lấy từ API)
    const clients = [...mockClients];

    // Filter the clients based on the search query
    const filteredClients =
        query === ""
            ? clients
            : clients.filter(client => {
                  return (
                      client.accountId
                          .toLowerCase()
                          .includes(query.toLowerCase()) ||
                      client.name.toLowerCase().includes(query.toLowerCase())
                  );
              });

    // Xử lý đóng dropdown khi click ngoài
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                comboboxRef.current &&
                !comboboxRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        // Thêm sự kiện click toàn bộ document
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Reset query when dropdown closes
    useEffect(() => {
        if (!isOpen) {
            setQuery("");
        }
    }, [isOpen]);

    return (
        <div ref={comboboxRef} className="relative w-full max-w-md">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                選択クライアント (Select Client)
            </label>
            <Combobox
                value={selectedClient}
                onChange={client => {
                    onClientSelect(client);
                    setIsOpen(false); // Đóng dropdown khi chọn client
                }}
                disabled={disabled}
            >
                <div className="relative">
                    <div className="relative w-full">
                        <Combobox.Input
                            className={`w-full rounded-md border ${
                                selectedClient
                                    ? "border-primary-600 ring-1 ring-primary-600"
                                    : "border-gray-300"
                            } bg-white py-3 pl-10 pr-10 shadow-sm focus:border-primary-600 focus:outline-none focus:ring-1 focus:ring-primary-600 sm:text-sm transition-all duration-200`}
                            displayValue={(client: Client | null) =>
                                client
                                    ? `${client.accountId} - ${client.name}`
                                    : ""
                            }
                            onChange={event => setQuery(event.target.value)}
                            placeholder="アカウントIDで検索 (Search by Account ID)"
                            onFocus={() => setIsOpen(true)}
                        />
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                            <UserCircleIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </div>
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronUpDownIcon
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        show={isOpen}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery("")}
                    >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredClients.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    検索結果がありません。(No results found.)
                                </div>
                            ) : (
                                filteredClients.map(client => (
                                    <Combobox.Option
                                        key={client.id}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? "bg-primary-600 text-white"
                                                    : "text-gray-900"
                                            }`
                                        }
                                        value={client}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <div className="flex flex-col">
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        <span className="font-semibold">
                                                            {client.accountId}
                                                        </span>{" "}
                                                        - {client.name}
                                                    </span>
                                                </div>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active
                                                                ? "text-white"
                                                                : "text-primary-600"
                                                        }`}
                                                    >
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>

            {/* Display selected client information */}
            {selectedClient && (
                <div className="mt-2 p-3 bg-primary-50 rounded-md border border-primary-200">
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
