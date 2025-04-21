// src/hooks/useClients.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClients } from "@/lib/api/client";
import { Client } from "@/types";
import { CaClient } from "@/lib/api/types";
import { useCallback } from "react";

const convertToClient = (caClient: CaClient): Client => ({
    id: caClient.client_id,
    accountId: caClient.client_id,
    name: caClient.client_name,
});

interface UseClientsParams {
    search?: string;
    limit?: number;
    enabled?: boolean;
}

export function useClients(params: UseClientsParams = {}) {
    const { search = "", limit = 100, enabled = true } = params;
    const queryClient = useQueryClient();

    const queryKey = ["clients", { search, limit }] as const;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await fetchClients({
                search,
                limit,
            });

            return {
                clients: response.results.map(convertToClient),
                totalCount: response.count,
            };
        },
        enabled,
        staleTime: 5 * 60 * 1000,
        gcTime: 15 * 60 * 1000,
    });

    const searchClients = useCallback(
        (newSearch: string) => {
            queryClient.invalidateQueries({
                queryKey: ["clients", { search: newSearch, limit }],
            });
        },
        [queryClient, limit],
    );

    const getClientById = useCallback(
        (clientId: string): Client | undefined => {
            return data?.clients.find(client => client.id === clientId);
        },
        [data?.clients],
    );

    return {
        clients: data?.clients || [],
        isLoading,
        error,
        totalCount: data?.totalCount || 0,
        searchClients,
        getClientById,
        refetch,
    };
}
