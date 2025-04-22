// src/lib/api/fetchUtils.ts

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetch wrapper that includes authentication
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @param isFormData - Flag to indicate if we're sending FormData
 * @returns Promise with the response
 */
export default async function fetchWithAuth(
    endpoint: string,
    options: RequestInit & { isFormData?: boolean } = {},
) {
    // Extract the isFormData flag and remove it from options to avoid fetch errors
    const { isFormData, ...fetchOptions } = options;

    // Get authentication token (implementation may vary based on your auth system)
    // This is just an example - adjust based on your actual auth implementation
    const token =
        sessionStorage.getItem("access_token") ||
        localStorage.getItem("access_token");

    // Prepare headers
    const headers: HeadersInit = {
        ...fetchOptions.headers,
    };

    // Only set Content-Type if we're not sending FormData
    if (!isFormData) {
        (headers as Record<string, string>)["Content-Type"] =
            "application/json";
    }

    // Add Authorization header if token exists
    if (token) {
        (headers as Record<string, string>)[
            "Authorization"
        ] = `Bearer ${token}`;
    }

    // Construct the full URL
    const url = `${API_BASE_URL}${endpoint}`;

    // Make the request with proper headers
    const response = await fetch(url, {
        ...fetchOptions,
        headers,
    });

    // Handle response
    if (!response.ok) {
        console.error(`API error: ${response.status} for ${url}`);
        throw new Error(`Failed to fetch from ${url}: ${response.status}`);
    }

    // Parse JSON response if Content-Type indicates JSON
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
        return response.json();
    }

    return response;
}
