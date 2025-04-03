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
    s3Link?: string | null; // Link S3 for completed downloads
    filename?: string | null; // Filename for reference
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

// Helper để tạo random filename và S3 link
const generateFileInfo = (client: Client, type: ActivityType) => {
    if (type !== "Download") return { filename: null, s3Link: null };

    const dateStr = new Date().toISOString().split("T")[0].replace(/-/g, "");
    const fileTypes = ["csv", "xlsx", "pdf", "json"];
    const fileType = fileTypes[Math.floor(Math.random() * fileTypes.length)];
    const randomId = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(4, "0");

    const filename = `${client.accountId}_export_${dateStr}_${randomId}.${fileType}`;
    const s3Link = `https://storage.example.com/exports/${client.id}/${filename}`;

    return { filename, s3Link };
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

    // Generate file info for Download type
    let fileInfo: { filename: string | null; s3Link: string | null } = {
        filename: null,
        s3Link: null,
    };
    if (type === "Download") {
        fileInfo = generateFileInfo(client, type);

        // Only successful downloads should have valid S3 links
        if (status !== "Success") {
            fileInfo.s3Link = null;
        }
    }

    return {
        id: `activity-${i + 1}`,
        startTime,
        endTime,
        client,
        status,
        user: `user${Math.floor(Math.random() * 5) + 1}@company.com`,
        type,
        filename: fileInfo.filename,
        s3Link: fileInfo.s3Link,
    };
});
