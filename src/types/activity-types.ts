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
    employee: Employee | null;
    dateOption: DateFilterOption;
    customStartDate: Date | null;
    customEndDate: Date | null;
    type: ActivityType | "All";
    status: ActivityStatus | "All";
    searchTerm: string;
}

export interface Employee {
    id: number;
    employee_id: string;
    employee_name: string;
}
