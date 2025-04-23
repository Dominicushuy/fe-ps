// src/lib/api/param-storage.ts (no changes from previous version)

import fetchWithAuth from "./fetchUtils";
import { ColumnFilter, DataLayer } from "@/types";

/**
 * Download Process response interface
 */
export interface FileProcessResponse {
    id: string;
    created: string;
    modified: string;
    employee_id: string;
    client_id: string;
    action_type: string;
    filter_details: Record<string, any>;
    status: string;
    start_time: string | null;
    end_time: string | null;
    is_duplicatable: boolean;
    file_path: string | null;
    batch_id: string | null;
    download_level: string | null;
}

/**
 * Valid column names for the API as enum values
 */
export enum ApiColumnName {
    MEDIA_ID = "media_id",
    C_ID = "c_id",
    ACCOUNT_ID = "account_id",
    CAMPAIGN_ID = "campaign_id",
    CAMPAIGN_NAME = "campaign_name",
    AD_GROUP_ID = "ad_group_id",
    AD_GROUP_NAME = "ad_group_name",
    AD_ID = "ad_id",
    KEYWORD_ID = "keyword_id",
    PARAM_URL = "param_url",
}

/**
 * Maps application column names to API column names
 * @param columnName - The column name from the application
 * @returns The corresponding API column name or null if not found
 */
function mapColumnNameToApi(columnName: string): ApiColumnName | null {
    // Map from application column names to API column names
    const columnNameMap: Record<string, ApiColumnName> = {
        媒体ID: ApiColumnName.MEDIA_ID,
        CID: ApiColumnName.C_ID,
        アカウントID: ApiColumnName.ACCOUNT_ID,
        キャンペーンID: ApiColumnName.CAMPAIGN_ID,
        キャンペーン名: ApiColumnName.CAMPAIGN_NAME,
        広告グループID: ApiColumnName.AD_GROUP_ID,
        広告グループ名: ApiColumnName.AD_GROUP_NAME,
        広告ID: ApiColumnName.AD_ID,
        キーワードID: ApiColumnName.KEYWORD_ID,
        パラメ発行済みURL: ApiColumnName.PARAM_URL,
    };

    return columnNameMap[columnName] || null;
}

/**
 * Create a download process in the Param Storage system
 * @param employeeId - The employee ID
 * @param clientId - The client ID
 * @param accountIds - Array of account IDs to filter by
 * @param downloadLevel - Download level (campaign, ad_group, ad, keyword, or ad_and_keyword)
 * @param filters - Array of column filters to apply
 * @returns Promise with the response from the API
 */
export async function createDownloadProcess(
    employeeId: string,
    clientId: string,
    accountIds: string[],
    downloadLevel: DataLayer | null,
    filters: ColumnFilter[],
): Promise<FileProcessResponse> {
    // Transform filters to the expected API structure
    const rules = filters
        .map(filter => {
            // Get the API column name
            const apiColumnName = mapColumnNameToApi(filter.columnName);

            // Skip filters with invalid column names
            if (!apiColumnName) {
                console.warn(
                    `Skipping filter with invalid column name: ${filter.columnName}`,
                );
                return null;
            }

            // Split the filter value by newlines to create an array of values
            const values = filter.value
                .split("\n")
                .map(v => v.trim())
                .filter(v => v.length > 0);

            return {
                column: apiColumnName,
                condition: {
                    operator: filter.operator,
                    value: values.length > 0 ? values : [""],
                },
            };
        })
        .filter(rule => rule !== null); // Remove any null rules (invalid columns)

    // Build the request payload
    const payload = {
        employee_id: employeeId,
        client_id: clientId,
        filter_details: {
            rules: rules,
            account_id_list: accountIds,
        },
        download_level: downloadLevel || "ad_and_keyword", // Default to ad_and_keyword if not specified
    };

    try {
        // Use the custom fetchWithAuth fetch wrapper
        return await fetchWithAuth("/param-storage/file-process/", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    } catch (error) {
        console.error("Error creating download process:", error);
        throw error;
    }
}
