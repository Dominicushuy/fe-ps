// src/hooks/useClientAccounts.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchClientAccounts } from "@/lib/api/media";
import { MediaAccount } from "@/types";
import { ApiMediaAccount } from "@/lib/api/types";
import { useCallback } from "react";

const convertToMediaAccount = (apiAccount: ApiMediaAccount): MediaAccount => {
    // Check if the logo_image_path is valid (not "nan" or undefined)
    const logoPath =
        apiAccount.media?.logo_image_path &&
        apiAccount.media.logo_image_path !== "nan"
            ? apiAccount.media.logo_image_path
            : null;

    return {
        id: apiAccount.media_account_id,
        accountId: apiAccount.media_account_id,
        name: apiAccount.media_account_name,
        mediaId: apiAccount.media?.media_id || "",
        mediaName: apiAccount.media?.media_name || "Unknown Media",
        logoPath: logoPath,
    };
};

interface UseClientAccountsParams {
    clientId: string | null;
    limit?: number;
    enabled?: boolean;
}

export function useClientAccounts(
    params: UseClientAccountsParams = { clientId: null },
) {
    const { clientId, limit = 100, enabled = true } = params;
    const queryClient = useQueryClient();

    const queryKey = ["clientAccounts", { clientId, limit }] as const;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            if (!clientId) return { accounts: [], totalCount: 0 };

            const response = await fetchClientAccounts(clientId, { limit });

            return {
                accounts: response.results.map(convertToMediaAccount),
                totalCount: response.count,
            };
        },
        enabled: enabled && !!clientId,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });

    const refreshAccounts = useCallback(() => {
        if (clientId) {
            queryClient.invalidateQueries({
                queryKey: ["clientAccounts", { clientId }],
            });
        }
    }, [queryClient, clientId]);

    return {
        accounts: data?.accounts || [],
        isLoading,
        error,
        totalCount: data?.totalCount || 0,
        refreshAccounts,
        refetch,
    };
}
