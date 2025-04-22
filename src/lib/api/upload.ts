// src/lib/api/upload.ts

import fetchWithAuth from "./fetchUtils";

/**
 * Upload a CSV file to the Param Storage system
 * @param file - The CSV file to upload
 * @param clientId - The client ID linked to this upload
 * @param isDuplicatable - Whether to allow duplicate records (default: false)
 * @returns Promise with the response from the API
 */
export async function uploadCSVFile(
    file: File,
    clientId: string,
    isDuplicatable: boolean = false,
): Promise<{ success: boolean }> {
    // Create a FormData instance to send the file
    const formData = new FormData();

    // Append the file, client_id, and is_duplicatable parameters
    formData.append("file", file);
    formData.append("client_id", clientId);
    formData.append("is_duplicatable", isDuplicatable.toString());

    try {
        // Use the custom fetchWithAuth fetch wrapper instead of fetch
        // This will handle authentication tokens appropriately
        const response = await fetchWithAuth("/param-storage/upload/", {
            method: "POST",
            body: formData,
            // No need to specify headers for FormData, fetchWithAuth should handle this
            isFormData: true, // Add this flag to indicate we're sending FormData
        });

        return response;
    } catch (error) {
        console.error("Error uploading CSV file:", error);
        throw error;
    }
}
