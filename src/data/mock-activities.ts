// /data/mock-activities.ts

import { Client } from "@/types";
import { mockClients } from "./mock-clients";

export type ActivityStatus = "Success" | "Processing" | "Failed";
export type ActivityType = "Download" | "Upload";

export interface Activity {
    id: string;
    startTime: Date;
    endTime: Date | null; // null for processing activities
    client: Client;
    status: ActivityStatus;
    user: string;
    type: ActivityType;
}

// Helper để tạo random past date
const randomPastDate = (daysAgo: number = 7) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    date.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        Math.floor(Math.random() * 60),
    );
    return date;
};

// Tạo mock activities
export const mockActivities: Activity[] = Array.from({ length: 50 }, (_, i) => {
    const client = mockClients[Math.floor(Math.random() * mockClients.length)];
    const type = Math.random() > 0.5 ? "Download" : "Upload";
    const status: ActivityStatus =
        Math.random() > 0.7
            ? "Success"
            : Math.random() > 0.5
            ? "Processing"
            : "Failed";

    const startTime = randomPastDate();
    let endTime = null;

    if (status !== "Processing") {
        endTime = new Date(startTime);
        endTime.setMinutes(
            endTime.getMinutes() + Math.floor(Math.random() * 30),
        );
    }

    return {
        id: `activity-${i + 1}`,
        startTime,
        endTime,
        client,
        status,
        user: `user${Math.floor(Math.random() * 5) + 1}@company.com`,
        type,
    };
});
