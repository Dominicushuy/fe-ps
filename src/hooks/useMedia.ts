// src/hooks/useMedia.ts
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMediaList } from "@/lib/api/media";
import { Media } from "@/types";
import { CaMedia } from "@/lib/api/types";
import { useCallback } from "react";

const convertToMedia = (caMedia: CaMedia): Media => ({
    id: caMedia.media_id,
    name: caMedia.media_name,
    logoPath: caMedia.logo_image_path,
});

interface UseMediaParams {
    search?: string;
    limit?: number;
    enabled?: boolean;
}

export function useMedia(params: UseMediaParams = {}) {
    const { search = "", limit = 100, enabled = true } = params;
    const queryClient = useQueryClient();

    const queryKey = ["media", { search, limit }] as const;

    const { data, isLoading, error, refetch } = useQuery({
        queryKey,
        queryFn: async () => {
            const response = await fetchMediaList({
                search,
                limit,
            });

            return {
                media: response.results.map(convertToMedia),
                totalCount: response.count,
            };
        },
        enabled,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });

    const searchMedia = useCallback(
        (newSearch: string) => {
            queryClient.invalidateQueries({
                queryKey: ["media", { search: newSearch, limit }],
            });
        },
        [queryClient, limit],
    );

    const getMediaById = useCallback(
        (mediaId: string): Media | undefined => {
            return data?.media.find(media => media.id === mediaId);
        },
        [data?.media],
    );

    return {
        media: data?.media || [],
        isLoading,
        error,
        totalCount: data?.totalCount || 0,
        searchMedia,
        getMediaById,
        refetch,
    };
}
