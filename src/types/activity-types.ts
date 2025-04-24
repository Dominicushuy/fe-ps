// src/types/activity-types.ts
import { Client } from "./index";

export type ActivityStatus =
    | "waiting"
    | "processing"
    | "done"
    | "invalid"
    | "error";
export type ActivityType = "Download" | "Upload";

export interface Activity {
    id: string;
    startTime: Date;
    endTime: Date | null;
    client: Client;
    status: ActivityStatus;
    user: string;
    type: ActivityType;
    s3Link?: string;
    filename?: string;
    isDuplicatable: boolean;
    batchId: string | null;
    downloadLevel: string | null;
}

export type DateFilterOption =
    | "Today"
    | "Yesterday"
    | "Last3Days"
    | "Last7Days"
    | "Custom";

export interface ActivityFilters {
    client: Client | null;
    dateOption: DateFilterOption;
    customStartDate: Date | null;
    customEndDate: Date | null;
    type: ActivityType | "All";
    status: ActivityStatus | "All";
}

export interface ActivityFilters {
    client: Client | null;
    dateOption: DateFilterOption;
    customStartDate: Date | null;
    customEndDate: Date | null;
    type: ActivityType | "All";
    status: ActivityStatus | "All";
    isDuplicatable: boolean | null; // Add this line
    searchTerm: string; // Add this line
}
