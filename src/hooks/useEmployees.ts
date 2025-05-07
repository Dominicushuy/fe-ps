// src/hooks/useEmployees.ts
import { useQuery } from "@tanstack/react-query";
import fetchWithAuth from "@/lib/api/fetchUtils";
import { Employee } from "@/types";

export function useEmployees() {
    return useQuery({
        queryKey: ["employees"],
        queryFn: async () => {
            const response = await fetchWithAuth(
                "/navi/user-management/employee-id-list/?name_include=true",
            );
            return response as Employee[];
        },
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 15 * 60 * 1000, // 15 minutes
    });
}
