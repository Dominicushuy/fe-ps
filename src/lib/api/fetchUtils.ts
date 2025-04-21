// src/lib/api/fetchUtils.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default async function fetchWithAuth(
    endpoint: string,
    options?: RequestInit,
): Promise<any> {
    const url = `${API_BASE_URL}${endpoint}`;
    let token: string | null = null;

    if (typeof window !== "undefined") {
        token = localStorage.getItem("access_token");
    }

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
            ...(options?.headers || {}),
        },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch from ${endpoint}: ${response.status}`);
    }

    const data = await response.json();
    return data;
}
