import { Client } from "./index";

export type ActivityStatus = "Success" | "Processing" | "Failed";
export type ActivityType = "Download" | "Upload";

export interface Activity {
    id: string;
    startTime: Date;
    endTime: Date | null;
    client: Client;
    status: ActivityStatus;
    user: string;
    type: ActivityType;
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
