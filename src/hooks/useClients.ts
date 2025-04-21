// src/hooks/useClients.ts
import { useState, useEffect, useCallback } from "react";
import { fetchClients } from "@/lib/api/client";
import { Client } from "@/types";
import { CaClient } from "@/lib/api/types";

const convertToClient = (caClient: CaClient): Client => ({
    id: caClient.client_id,
    accountId: caClient.client_id,
    name: caClient.client_name,
});

interface UseClientsParams {
    search?: string;
    limit?: number;
}

export function useClients(initialParams?: UseClientsParams) {
    const [searchTerm, setSearchTerm] = useState<string>(
        initialParams?.search || "",
    );
    const [clients, setClients] = useState<Client[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);
    const [totalCount, setTotalCount] = useState<number>(0);

    const limit = initialParams?.limit || 100;

    const fetchClientsData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetchClients({ search: searchTerm, limit });
            const convertedClients = response.results.map(convertToClient);

            setClients(convertedClients);
            setTotalCount(response.count);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err
                    : new Error("Failed to fetch clients"),
            );
            console.error("Error fetching clients:", err);
        } finally {
            setIsLoading(false);
        }
    }, [searchTerm, limit]);

    useEffect(() => {
        fetchClientsData();
    }, [fetchClientsData]);

    const getClientById = useCallback(
        (clientId: string): Client | undefined => {
            return clients.find(client => client.id === clientId);
        },
        [clients],
    );

    const searchClients = useCallback((term: string) => {
        setSearchTerm(term);
    }, []);

    const refetch = useCallback(() => {
        fetchClientsData();
    }, [fetchClientsData]);

    return {
        clients,
        isLoading,
        error,
        totalCount,
        searchClients,
        getClientById,
        refetch,
    };
}
