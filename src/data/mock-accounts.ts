// src/data/mock-accounts.ts
import { MediaAccount } from "@/types";
import { mockMediaList } from "./mock-media";

// Helper function to generate account types
const accountTypes = [
    "Main",
    "Secondary",
    "Brand",
    "Performance",
    "Conversion",
    "Retargeting",
    "Engagement",
    "Discovery",
];

// Generate accounts for each media
export const mockAccounts: MediaAccount[] = mockMediaList.flatMap(media => {
    // Generate between 2 and 6 accounts per media
    const numAccounts = Math.floor(Math.random() * 5) + 2;
    const accounts: MediaAccount[] = [];

    for (let i = 1; i <= numAccounts; i++) {
        // Create prefix based on media name (e.g., "GO" for Google, "FB" for Facebook)
        let prefix = media.name.substring(0, 2).toUpperCase();

        // Handle special cases with symbols or non-English characters
        if (media.name.includes("【") || media.name.includes("】")) {
            prefix = media.name
                .replace(/【.*】\s*/g, "")
                .substring(0, 2)
                .toUpperCase();
        }

        // Create random account ID
        const accountNumber = Math.floor(Math.random() * 90000) + 10000;
        const accountId = `${prefix}-${accountNumber}`;

        // Select random account type or combine two for more variety
        const accountType =
            i <= accountTypes.length
                ? accountTypes[i - 1]
                : `${
                      accountTypes[
                          Math.floor(Math.random() * accountTypes.length)
                      ]
                  } ${
                      accountTypes[
                          Math.floor(Math.random() * accountTypes.length)
                      ]
                  }`;

        accounts.push({
            id: `acc-${media.id}-${i}`,
            mediaId: media.id,
            accountId: accountId,
            name: `${media.name} ${accountType}`,
        });
    }

    return accounts;
});
